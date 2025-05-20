import express from "express";
import rootRouter from "../routes/index"
import env from 'dotenv';

env.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', rootRouter);
app.get('/', (req, res) => {res.send("oke jalan hahahaha")});

app.listen(8000, () => {
  console.log("server running on port 8000");
});

export default app;