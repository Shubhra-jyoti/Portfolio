const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    semester: { 
        type: Number, 
        required: true,
        unique: true 
    },
    spi: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Stat', statsSchema);