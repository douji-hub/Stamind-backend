import app from './app';
import mongoose from "mongoose"
import fs from 'fs'
import './database/mongodb'
import http from 'http'
import https from 'https'

const PORT = process.env.PORT;
try {
    const certKeyOption = {
        cert: fs.readFileSync('/etc/letsencrypt/live/ccj.infocom.yzu.edu.tw/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/ccj.infocom.yzu.edu.tw/privkey.pem')
    }
    console.log("SSL certificates found and accessible, running in HTTPS");
    https.createServer(certKeyOption, app).listen(PORT, () => {
        console.log("Server is runing at " + 'https://localhost' + ":" + PORT)
    })
}
catch (err) {
    console.log("SSL certificates not found or inaccessible, falling back to HTTP");
    http.createServer(app).listen(PORT, () => {
        console.log("Server is runing at " + 'http://localhost' + ":" + PORT)
    })
}
finally {
    // mongodb connect testing
    const mongoDbStatus = mongoose.connection
    mongoDbStatus.on('error', err => console.error('connection error', err))
    mongoDbStatus.once('open', (db) => console.log('Connection to mongodb'))
}





