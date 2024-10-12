import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger/swaggerDocs';
import routeHub from './routes/routeHub';

dotenv.config();

const app = express();

//用於解析json row txt URL-encoded格式
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json())
app.use(urlencodedParser)
app.use(cookieParser())

/**
 * TODO: Error handling: A global error handling middleware can be introduced to handle exceptions uniformly and avoid repeated error handling.
 * TODO: Logging: Use log libraries such as winston or morgan to record request and error information to facilitate debugging and monitoring
 * TODO: Test: Write unit tests and integration tests to ensure the normal function of each module
 * TODO: Code style: Use tools such as ESLint and Prettier to maintain style consistency
 */


// for check nginx load balance
const INSTANCE_NAME: String = process.env.INSTANCE_NAME || "app";

app.get('/', (req, res) => {
    res.send(`Hello from ${INSTANCE_NAME}`);
});

app.use('/api', routeHub);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default app;