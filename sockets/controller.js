const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers/generar-jwt');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async(socket = new Socket(), io) => {
    // comprobamos el token 
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if(!usuario){
        //console.log('se desconectó el socket');
        return socket.disconnect();
    }
    // agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    // enviamos al usuario  que acaba de conectarse los últimos 10 mensajes
    socket.emit('recibir-mensajes', chatMensajes.ultimos10); 
    socket.emit('mensaje-privado', chatMensajes.ultimos10Privados);
    // conectarlo a una sala especial
    socket.join(usuario.id); //sala global, socket.id, usuario.id

    // limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });
    // 
    socket.on('enviar-mensaje', ({ mensaje, uid }) => {
        // verificar si es un mensaje privado
        if(uid){
            // si es privado
            chatMensajes.enviarMensajeP(usuario.id, usuario.nombre, mensaje);
            // enviamos el mensaje al uid destino
            socket.to(uid).emit('mensaje-privado', chatMensajes.ultimos10Privados);
            // TODO: actulmente no se escribe en la lista de chat privado lo que mandamos 
            // hasta que no recibimos algo enviado por otos, hay que ver como hacer esto
        }else{
            // si es público
            // enviamos el mensaje a todos
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            // con esto escribimos el mensaje en nuestro chat público
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });

}

module.exports = {
    socketController
}