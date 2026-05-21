import express, { type Request, type Response } from 'express';
import { authRoutes } from './modules/auth/auth.route';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/auth', authRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('DevPulse  server is running!');
})


export default app;