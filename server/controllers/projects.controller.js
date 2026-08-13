const ProjectMeta = require('../models/ProjectMeta.model');

let cachedProjects = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const getProjects = async (req, res) => {
    try {
        const now = Date.now();
        
        // Use cache to be lightning fast, but it updates dynamically every 15 mins
        if (cachedProjects && (now - cacheTimestamp < CACHE_DURATION)) {
            return res.status(200).json({ status: "success", data: cachedProjects });
        }

        const headers = {
            'User-Agent': 'Portfolio-App'
        };
        
        const githubUsername = process.env.GITHUB_USERNAME || 'Shubhra-jyoti';
        
        // Default URL for public repos
        let fetchUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated`;
        
        // If the VIP token exists, pull Collaborations as well
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
            fetchUrl = `https://api.github.com/user/repos?sort=updated&affiliation=owner,collaborator`;
        }

        const response = await fetch(fetchUrl, { headers });
        
        if (!response.ok) {
            throw new Error(`GitHub API returned status ${response.status}`);
        }

        const rawRepos = await response.json();
        
        // RE-ADDED THE FORK FILTER: This instantly destroys duplicates from forked collaborations
        const originalRepos = Array.isArray(rawRepos) ? rawRepos.filter(repo => repo.fork === false) : [];

        let customOverrides = [];
        try {
            customOverrides = await ProjectMeta.find() || [];
        } catch (dbErr) {
            console.error("MongoDB Warning:", dbErr.message);
        }

        // 1. FIXED: Map by the unique repoId (as a string) instead of repoName
        const overrideMap = customOverrides.reduce((acc, curr) => {
            if (curr && curr.repoId) acc[curr.repoId] = curr;
            return acc;
        }, {});

        const optimizedRepos = await Promise.all(originalRepos.map(async (repo) => {
            // 2. FIXED: Lookup using the repo.id
            const customData = overrideMap[repo.id.toString()] || {};
            let allLanguages = [];
            
            if (customData.languages && Array.isArray(customData.languages) && customData.languages.length > 0) {
                allLanguages = customData.languages;
            } else {
                try {
                    const langRes = await fetch(repo.languages_url, { headers });
                    if (langRes.ok) {
                        const langData = await langRes.json();
                        allLanguages = Object.keys(langData);
                    }
                } catch (langErr) {
                    console.error(`Failed to fetch languages for ${repo.name}`);
                }

                if (allLanguages.length === 0 && repo.language) {
                    allLanguages.push(repo.language);
                } else if (allLanguages.length === 0) {
                    allLanguages.push("N/A");
                }
            }

            return {
                id: repo.id,
                name: repo.name,
                // 3. FIXED: Aligned with the exact names in your Admin Panel schema
                description: customData.customDescription || repo.description || "System architecture data pending transmission.",
                role: customData.role || "Developer",
                languages: allLanguages,
                githubLink: repo.html_url,
                liveLink: customData.liveUrl || repo.homepage || null,
                isHidden: customData.isHidden || false // Added hide toggle
            };
        }));

        // 4. FIXED: Actually filter out the projects you marked as hidden
        const visibleProjects = optimizedRepos.filter(project => !project.isHidden);

        // Update the cache with the filtered, merged data
        cachedProjects = visibleProjects;
        cacheTimestamp = now;

        res.status(200).json({ status: "success", data: visibleProjects });

    } catch (error) {
        console.error("CRITICAL BACKEND ERROR:", error.message);
        
        if (cachedProjects) {
            return res.status(200).json({ status: "success", data: cachedProjects, warning: "Served from stale cache." });
        }

        return res.status(200).json({ status: "success", data: [], warning: "Waiting for GitHub synchronization..." });
    }
};

module.exports = { getProjects };