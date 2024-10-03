import app from './app';
import mongoose from "mongoose"
import './database/mongodb'

const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// mongodb connect testing
const mongoDbStatus = mongoose.connection
mongoDbStatus.on('error', err => console.error('connection error', err))
mongoDbStatus.once('open', (db) => console.log('Connection to mongodb'))

