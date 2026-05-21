import express, { type Request, type Response } from 'express';
const app = express();
// import cors from 'cors';
// import dotenv from 'dotenv';


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/', (req: Request, res: Response) => {
  res.send('DevPulse  server is running!');
})


export default app;