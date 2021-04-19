const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas =  ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    //retornamos una promesa
    return new Promise((resolve, reject) => {
        // obtener el nombre del archivo
        const { archivo } = files;
        // extraer la extensión del archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        // validar las extensiones permitidas
        if(!extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, las extensiones válidas son: ${extensionesValidas}`);
        }
        //generar un nombre único al archivo subido
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
        // movemos el archivo al path
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });
    }); // fin de la promesa
    
}

module.exports = {
    subirArchivo
}