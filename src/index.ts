import express from 'express';
import agendamentoRoutes from './routes/agendamentoRoutes';

const app = express();

app.use(express.json());
app.use('/api', agendamentoRoutes);

const PORT = process.env.PORT || 3000;

export default app;