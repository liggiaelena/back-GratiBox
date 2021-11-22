import express from 'express';
import cors from 'cors';
import { postSingUp, postSingIn } from './controllers/registration.js';
import { postSubscribeInfo, postSubscriptions, getSubscriptions } from './controllers/subscribe.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.post('/sing-up', (req, res) => postSingUp(req, res));
app.post('/sing-in', (req, res) => postSingIn(req, res));
app.post('/subscribe', (req, res) => postSubscribeInfo(req, res));
app.post('/subscriptions', (req, res) => postSubscriptions(req, res));
app.get('/subscriptions', (req, res) => getSubscriptions(req, res));

export default app;
