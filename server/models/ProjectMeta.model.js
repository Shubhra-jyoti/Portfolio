const mongoose = require('mongoose');

const projectMetaSchema = new mongoose.Schema({
    repoId: { type: String, required: true, unique: true }, // The unique GitHub ID
    repoName: { type: String, required: true }, // The GitHub repo name
    customDescription: { type: String }, // Overrides the GitHub description
    role: { type: String }, // e.g., "Frontend Architect", "AI Engineer"
    liveUrl: { type: String }, // Link to the deployed site
    isHidden: { type: Boolean, default: false } // Toggle to hide a project from the portfolio
});

module.exports = mongoose.model('ProjectMeta', projectMetaSchema);