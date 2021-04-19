
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: [true, 'El estado es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: [true, 'El usuario es obligatorio']
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: [true, 'La categoría es obligatoria y debe existir']
    },
    descripcion: { 
        type: String 
    },
    disponible: { 
        type: Boolean, 
        default: true 
    },
    img: {
        type: String,
    },
});

// formatea el json para mostrar determinados campos y de una forma determinada
ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema);