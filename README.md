# Photography Portfolio with Click Speed Game

A photography portfolio website with an interactive click speed test game and live leaderboard.

## Features

- **Under Development Page**: Professional "coming soon" page
- **Click Speed Test Game**: 10-second clicking challenge
- **Live Leaderboard**: Real-time top 10 scores with backend storage
- **Player Registration**: Name input and score tracking
- **Server Status**: Live connection indicator
- **Anti-Cheat**: Basic prevention measures

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Game**
   - Open your browser and go to: `http://localhost:3000`
   - The game will be available immediately

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### GET /api/leaderboard
Returns the top 10 scores
```json
{
  "success": true,
  "data": [
    {
      "name": "Player1",
      "score": 127,
      "timestamp": "2025-01-08T12:00:00.000Z",
      "id": "unique-id"
    }
  ]
}
```

### POST /api/leaderboard
Submit a new score
```json
{
  "name": "PlayerName",
  "score": 95
}
```

Response:
```json
{
  "success": true,
  "message": "Score added successfully",
  "data": [...], // Updated top 10
  "playerRank": 5
}
```

### GET /api/health
Check server status
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-08T12:00:00.000Z"
}
```

### DELETE /api/leaderboard
Clear all scores (admin only)

## File Structure

```
pehechan/
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── photography.html       # Main game page
├── leaderboard.json       # Score database (auto-created)
└── README.md              # This file
```

## Game Rules

1. Enter your name (max 20 characters)
2. Click the red button as fast as possible for 10 seconds
3. Your score is automatically submitted to the leaderboard
4. Top 10 scores are displayed with rankings
5. Gold 🥇, Silver 🥈, Bronze 🥉 medals for top 3

## Technical Details

- **Backend**: Node.js + Express
- **Database**: JSON file (easily upgradeable to MySQL/MongoDB)
- **Frontend**: Vanilla JavaScript + CSS
- **Real-time Updates**: Automatic leaderboard refresh every 30 seconds
- **Validation**: Server-side score validation (0-1000 range)
- **Storage**: Top 100 scores kept, top 10 displayed

## Security Features

- Input validation and sanitization
- Score range validation (prevents impossible scores)
- Rate limiting ready (can be added)
- XSS protection through input sanitization

## Deployment

### Local Development
```bash
npm start
```

### Production Deployment
1. Set up a VPS or cloud server
2. Install Node.js
3. Clone/upload your files
4. Run `npm install`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "photography-game"
   ```

### Environment Variables (Optional)
```bash
PORT=3000                    # Server port
LEADERBOARD_FILE=./data.json # Custom database file path
```

## Upgrading to Real Database

To upgrade from JSON file to a real database:

1. **MySQL Example**:
   ```javascript
   const mysql = require('mysql2/promise');
   // Replace file operations with SQL queries
   ```

2. **MongoDB Example**:
   ```javascript
   const mongoose = require('mongoose');
   // Replace file operations with MongoDB operations
   ```

## Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`

### Leaderboard Not Loading
- Check server status indicator on the page
- Verify server is running: `http://localhost:3000/api/health`
- Check browser console for errors

### Scores Not Submitting
- Ensure server is online (green indicator)
- Check network connection
- Verify name is entered (required field)

## License

MIT License - Feel free to use and modify for your projects.