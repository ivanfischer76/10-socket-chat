# 10-socket-chat

Ejercicio del curso NodeJs de cero a experto dictado por Fernando Herrera en udemy.

Socket chat básico con autenticación de usuarios por token y REST Server completo con autenticación de usuarios por token, base de datos mongodb y subida de archivos de imágen a servidor o a cloudinary.

El archivo ```restServer_Node-express.postman_collection.json``` es una colección de postman para probar los enpoint. En postman hay que definir una variable de entorno para url en ```localhost:8085/```, donde el 8082 es el puerto en el que levantamos la aplicación con ```node app``` o ```nodemon app``` o bien reelmplazar las ```{{url}}``` por ```localhost:8085/``` para el ambiente de desarrollo

Para ver la documentación de esta colección de postman visitar: [https://documenter.getpostman.com/view/14198728/TzCS4kcL](https://documenter.getpostman.com/view/14198728/TzCS4kcL)

El Frontend no está muy desarrollado puesto que el propósito de este ejercicio es armar el backend, el frontend es básico pero permite enviar y recibir mensajes de chats públicos y privados y mostrar los usuarios conectados.

