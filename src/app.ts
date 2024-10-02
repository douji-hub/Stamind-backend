//express
import express from 'express'
import cors from 'cors'
//.env環境檔案
import dotenv from 'dotenv'
//用於解析json row txt URL-encoded格式
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express();

//.env config
dotenv.config()

//用於解析json row txt URL-encoded格式
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
app.use(urlencodedParser)
app.use(cookieParser())

// Simple route
app.get('/api/hello', (req, res) => {
    res.json({message: 'Hello, World!'});
});

export default app;
