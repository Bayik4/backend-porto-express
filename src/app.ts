import express from "express";
import rootRouter from "./routes/index"
import env from 'dotenv';

env.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', rootRouter);

export default app;