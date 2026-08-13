const ProjectMeta = require('../models/ProjectMeta.model');

// Get all overrides (Used by the dashboard to see what's already saved)
const getOverrides = async (req, res) => {
    try {
        const overrides = await ProjectMeta.find();
        res.status(200).json(overrides);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project configurations." });
    }
};

// Create or Update an override (Secured Route)
const saveOverride = async (req, res) => {
    try {
        const { repoId, repoName, customDescription, role, liveUrl, isHidden } = req.body;

        // Using upsert: If it exists, update it. If not, create it.
        const updatedMeta = await ProjectMeta.findOneAndUpdate(
            { repoId }, 
            { repoName, customDescription, role, liveUrl, isHidden },
            { new: true, upsert: true } 
        );

        res.status(200).json({ message: "Project configuration updated.", data: updatedMeta });
    } catch (error) {
        res.status(500).json({ message: "Failed to save configuration." });
    }
};

module.exports = { getOverrides, saveOverride };