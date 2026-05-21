import express, { type Request, type Response } from 'express';
import { authRoutes } from './modules/auth/auth.route';
import issueRoutes from './modules/issue/issue.route';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/auth', authRoutes);
app.use("/api/issues", issueRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('DevPulse  server is running!');
})




export default app;