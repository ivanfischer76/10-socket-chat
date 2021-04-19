
const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

//obtener un listado paginado de usuarios
const usuariosGet = async(req, res = response) => {
    //const {q, nombre = 'No name', apikey, page = 1, limit = 10} = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    // de esta manera se emplea mas tiempo pues debe esperar a que se 
    // resuelva una promesa para ejecutar al otra
    // const usuarios = await Usuario.find(query)
    //     .limit(Number(limite))
    //     .skip(Number(desde));
    // const total = await Usuario.countDocuments(query);

    // de esta manera toma menos tiempo porque resuelve las dos promesas al mismo tiempo
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .limit(Number(limite))
        .skip(Number(desde))
    ]);

    res.json({
        enviados: limite,
        total,
        usuarios
    });
}

// crear un usuario
const usuariosPost = async(req, res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    
    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en DB
    await usuario.save();

    // Retornar el json
    res.json({
        usuario
    })
}

// actualizar un usuario
const usuariosPut = async(req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, correo, ...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

// 
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

// borrar usuario - estado=false
const usuariosDelete = async(req = request, res = response) => {
    const id = req.params.id;
    //const uid = req.uid;
    // borrarlo físicamente de la base de datos
    // const usuario = await Usuario.findByIdAndDelete(id);
    // soft delete, cambiando la constante estado a false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    // const usuarioAutenticado = req.usuario;
    res.json({ 
        usuario,
        //usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}