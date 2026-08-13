const OperatorMeta = require('../models/OperatorMeta.model');

// Fetch the data for the public homepage
const getOperator = async (req, res) => {
    try {
        let operator = await OperatorMeta.findOne();
        
        // If the database is empty, send a blank template so the frontend doesn't crash
        if (!operator) {
            operator = { 
                avatarUrl: "", bio: "System bio pending...", resumeUrl: "", 
                frontendTech: [], backendTech: [], hardwareTech: [] 
            };
        }
        
        res.status(200).json({ status: "success", data: operator });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch operator profile." });
    }
};

// Secure save route for the Admin Dashboard
const saveOperator = async (req, res) => {
    try {
        const updateData = req.body;
        
        // Upsert: Update the existing document, or create it if it doesn't exist yet
        const updatedOperator = await OperatorMeta.findOneAndUpdate(
            {}, 
            updateData,
            { new: true, upsert: true }
        );
        
        res.status(200).json({ status: "success", data: updatedOperator });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to save operator profile." });
    }
};

module.exports = { getOperator, saveOperator };