

const url = (window.location.hostname.includes('localhost'))
          ? `http://localhost:8085/api/auth/`
          : 'https://rest-server-node-fh.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

// Referencias HTML
const txtUid      = document.querySelector('#txtUid');
const txtMensaje  = document.querySelector('#txtMensaje');
const ulUsuarios  = document.querySelector('#ulUsuarios');
const ulMensajes  = document.querySelector('#ulMensajes');
const ulMensajesP = document.querySelector('#ulMensajesPrivados');
const btnSalir    = document.querySelector('#btnSalir');


// Validar e token del localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    try{
        const resp = await fetch(url, {
            headers: { 'x-token': token }
        });
    
        const {usuario: userDB, token: tokenDB } = await resp.json();
        // console.log(userDB, tokenDB);
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre;
        await conectarSocket();
    }catch(error){
        console.log(error);
        window.location = 'index.html';
    }
    
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    // Eventos
    // cuando se conecta
    socket.on('connect', () => {
        console.log('Sockets online');
    });
    // cuando se desconecta
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });
    // escuchamos cuando se emita un mensaje
    socket.on('recibir-mensajes', dibujarMensajes);
    // escuchamos cuando se emita un mensaje privado
    socket.on('mensaje-privado', dibujarMensajesPrivados);
    // escuchamos usuarios activos
    socket.on('usuarios-activos', dibujarUsuarios);
    
}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach( ({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${nombre}:</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMensajes.innerHTML = mensajesHtml;
    
}

const dibujarMensajesPrivados = (mensajesP = []) => {
    let mensajesPHtml = '';
    mensajesP.forEach( ({ nombre, mensaje }) => {
        mensajesPHtml += `
            <li>
                <p>
                    <h5 class="text-secondary">${nombre}:</h5>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMensajesP.innerHTML = mensajesPHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;
    if(keyCode !== 13){ return; }
    if(mensaje.length === 0){ return; }
    socket.emit('enviar-mensaje', { mensaje , uid });
    txtMensaje.value = '';
});



const main = async() => {

    // validar JWT
    await validarJWT();

}

main();
