import mongoose from 'mongoose'

const DB_URL: string = process.env.DB_CONNECTION_URL || '';


export default mongoose.connect(DB_URL);