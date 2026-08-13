const Stat = require('../models/Stats.model'); // Assuming your model is named Stat.model.js

// Public route: Fetch all semester stats, sorted by semester number
const getStats = async (req, res) => {
    try {
        const stats = await Stat.find().sort({ semester: 1 });
        res.status(200).json({ status: "success", data: stats });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to fetch telemetry data." });
    }
};

// Secure route: Add or update a semester's SPI
const saveStat = async (req, res) => {
    try {
        const { semester, spi } = req.body;
        
        if (!semester || !spi) {
            return res.status(400).json({ status: "error", message: "Semester and SPI are required." });
        }

        // Upsert: Find by semester. If it exists, update SPI. If not, create new.
        const updatedStat = await Stat.findOneAndUpdate(
            { semester: Number(semester) },
            { spi: Number(spi) },
            { new: true, upsert: true }
        );
        
        res.status(200).json({ status: "success", data: updatedStat });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({ status: "error", message: "Failed to save telemetry data." });
    }
};

// Secure route: Delete a specific semester if a mistake was made
const deleteStat = async (req, res) => {
    try {
        const { semester } = req.params;
        await Stat.findOneAndDelete({ semester: Number(semester) });
        res.status(200).json({ status: "success", message: "Telemetry entry purged." });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to delete entry." });
    }
};

module.exports = { getStats, saveStat, deleteStat };