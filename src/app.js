import express from 'express';
import cors from 'cors';
import { postSingUp, postSingIn } from './controllers/registration.js';
import {
  postSubscribeInfo, postSubscription, getSubscription, postDeliveryDays, getStates,
} from './controllers/subscribe.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.post('/sing-up', (req, res) => postSingUp(req, res));
app.post('/sing-in', (req, res) => postSingIn(req, res));
app.post('/subscribe', (req, res) => postSubscribeInfo(req, res));
app.post('/subscriptions', (req, res) => postSubscription(req, res));
app.get('/subscriptions', (req, res) => getSubscription(req, res));
app.post('/delivery-days', (req, res) => postDeliveryDays(req, res));
app.get('/states', (req, res) => getStates(req, res));

export default app;
