
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
});

// formatea el json para mostrar determinados campos y de una forma determinada
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);