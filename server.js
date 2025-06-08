const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize leaderboard file if it doesn't exist
async function initializeLeaderboard() {
    try {
        await fs.access(LEADERBOARD_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(LEADERBOARD_FILE, JSON.stringify([]));
        console.log('Created new leaderboard.json file');
    }
}

// Read leaderboard from file
async function readLeaderboard() {
    try {
        const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        return [];
    }
}

// Write leaderboard to file
async function writeLeaderboard(leaderboard) {
    try {
        await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
    } catch (error) {
        console.error('Error writing leaderboard:', error);
        throw error;
    }
}

// Validate score data
function validateScore(name, score) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return { valid: false, error: 'Name is required and must be a non-empty string' };
    }
    
    if (name.length > 20) {
        return { valid: false, error: 'Name must be 20 characters or less' };
    }
    
    if (typeof score !== 'number' || score < 0 || score > 1000) {
        return { valid: false, error: 'Score must be a number between 0 and 1000' };
    }
    
    return { valid: true };
}

// API Routes

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await readLeaderboard();
        
        // Sort by score (descending) and return top 10
        const topScores = leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        
        res.json({
            success: true,
            data: topScores
        });
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve leaderboard'
        });
    }
});

// Add new score
app.post('/api/leaderboard', async (req, res) => {
    try {
        const { name, score } = req.body;
        
        // Validate input
        const validation = validateScore(name, score);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }
        
        // Read current leaderboard
        let leaderboard = await readLeaderboard();
        
        // Add new score with timestamp
        const newEntry = {
            name: name.trim(),
            score: Math.floor(score), // Ensure integer
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random() // Simple unique ID
        };
        
        leaderboard.push(newEntry);
        
        // Sort by score (descending) and keep top 100 (to prevent file from growing too large)
        leaderboard = leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 100);
        
        // Save to file
        await writeLeaderboard(leaderboard);
        
        // Return top 10 for display
        const topScores = leaderboard.slice(0, 10);
        
        res.json({
            success: true,
            message: 'Score added successfully',
            data: topScores,
            playerRank: leaderboard.findIndex(entry => entry.id === newEntry.id) + 1
        });
        
    } catch (error) {
        console.error('Error adding score:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add score'
        });
    }
});

// Clear leaderboard (admin endpoint)
app.delete('/api/leaderboard', async (req, res) => {
    try {
        await writeLeaderboard([]);
        res.json({
            success: true,
            message: 'Leaderboard cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear leaderboard'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'photography.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    try {
        await initializeLeaderboard();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
            console.log(`🎮 Game: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();