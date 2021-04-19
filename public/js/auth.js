
//
const miFormulario = document.querySelector('form');

//console.log(window.location.hostname)
//url de inicio de sesión
const url = (window.location.hostname.includes('localhost'))
          ? `http://localhost:8085/api/auth/`
          : 'https://rest-server-node-fh.herokuapp.com/api/auth/';


// escuchar los eventos del formulario
miFormulario.addEventListener('submit', ev => {
  ev.preventDefault(); //prevenimos la accion por default que es recargar el navegador
  const formData = {};
  for(let el of miFormulario.elements){
    if(el.name.length > 0){
      formData[el.name] = el.value;
    }
  }
  fetch(url + "login", {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {'Content-Type': 'application/json'}
  })
  .then(resp => resp.json())
  .then(({msg, token}) => {
    if(msg){
      return console.error(msg);
    }
    localStorage.setItem('token', token);
    window.location = 'chat.html';
  })
  .catch(err => {
    console.log(err);
  });
});

// iniciar sesión con google
function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  
  var id_token = googleUser.getAuthResponse().id_token;
  const data = {id_token};
  fetch(url + "google", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then( ({ token }) => {
    localStorage.setItem('token', token); //guarda el token en el local storage
    window.location = 'chat.html';
  })
  .catch(console.log);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}