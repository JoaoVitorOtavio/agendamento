import express from 'express';
import agendamentoRoutes from './routes/agendamentoRoutes';

const app = express();

app.use(express.json());
app.use('/api', agendamentoRoutes);

export default app;