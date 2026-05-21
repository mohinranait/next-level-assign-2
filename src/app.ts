import express, { type Request, type Response } from 'express';
import { authRoutes } from './modules/auth/auth.route';
import issueRoutes from './modules/issue/issue.route';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/api/auth', authRoutes);
app.use("/api/issues", issueRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('DevPulse  server is running!');
})


app.use(notFound);
app.use(errorHandler);



export default app;