const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');


const cargarArchivo = async (req = request, res = response) => {
    try {
        // //imágenes
        // const nombre = await subirArchivo(req.files);
        //txt, md
        const nombre = await subirArchivo(req.files, undefined, 'imgs'); //con undefined aceptamos los argumentos por default
        res.json({nombre});
    } catch (msg) {
        res.status(400).json({msg});
    }
}

// cargar las imágenes en el servidor donde está desplegada la aplicación 
// (no sirve en heroku pero si en un servidor dedicado)
const actualizarImagen = async(req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto: controllers.uploads.actualizarImagen'});
            break;
    }
    //limpiar imágenes previas
    try {
        if(modelo.img){
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (err) {
        console.log(err);
        res.json({msg: err});
    }
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json({ modelo });
}

// cargar las imágenes en un servicio como cloudinary para cuando hacemos despliegues en heroku
const actualizarImagenCloudinary = async(req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto: controllers.uploads.actualizarImagen'});
            break;
    }
    //limpiar imágenes previas
    try {
        if(modelo.img){
            // hay que borrar la imagen de cloudinary
            const nombreArr = modelo.img.split('/');
            const nombre    = nombreArr[nombreArr.length -1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
    } catch (err) {
        console.log(err);
        res.json({msg: err});
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);   
    modelo.img = secure_url;
    await modelo.save();
    res.json({ modelo });
}

const mostrarImagen = async(req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto: controllers.uploads.mostrarImagen'});
            break;
    }
    //limpiar imágenes previas
    try {
        if(modelo.img){
            // hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                return res.sendFile(pathImagen);
            }
        }
    } catch (err) {
        console.log(err);
        res.json({msg: err});
    }
    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathNoImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
