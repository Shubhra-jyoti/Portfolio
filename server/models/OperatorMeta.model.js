const mongoose = require('mongoose');

const operatorMetaSchema = new mongoose.Schema({
    avatarUrl: { type: String, default: "" }, 
    bio: { type: String, default: "" },
    
    // THE UPGRADE: Replaced the single string with an array of objects
    resumes: { 
        type: [{ 
            title: String, 
            url: String 
        }], 
        default: [] 
    },
    
    frontendTech: { type: [String], default: [] }, 
    backendTech: { type: [String], default: [] }, 
    databaseTech: { type: [String], default: [] }
});

module.exports = mongoose.model('OperatorMeta', operatorMetaSchema);