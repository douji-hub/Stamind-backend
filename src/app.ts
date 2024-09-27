import express from 'express';

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Simple route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

export default app;
