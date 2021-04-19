const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //verificar si el usuario está activo en la DB
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            });
        }
        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salió mal, hable con el administrador',
            error
        });
    }   
}

const googleSignin = async(req = request, res = response) => {
    const {id_token} = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        //verificar si el correo ya existe en la base de datos
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            // si el usuario no existe lo creo
            const data = {
                nombre,
                correo,
                password: ':-(',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        // si el usuario en DB esta borrado niego el acceso
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Usuario bloqueado. Hable con el administrador.'
            });
        }
        //generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario, 
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        });
    }
}

const renovarToken = async(req = request, res = response) => {
    const { usuario } = req; // obtenemos el usuario del reques
    const token = await generarJWT(usuario.id); // generamos un nuevo jwt
    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}