import connection from '../database.js';
import { subscribeValidation, subscriptionsValidation } from '../validations/registrationValidation.js';

async function postSubscribeInfo(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    fullName,
    address,
    cep,
    city,
    stateId,
  } = req.body;

  const validation = subscribeValidation.validate(req.body);
  if (validation.error) {
    res.status(400).send({
      message: validation.error.details[0].message,
    });
    return;
  }

  try {
    const user = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);
    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }
    const date = new Date();

    await connection.query(`
        INSERT INTO subscribers_info(full_name, address, cep, city, state_id, user_id, registration_date) VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [fullName, address, cep, city, stateId, user.rows[0].user_id, date]);

    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function postSubscriptions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const {
    deliveryDayId,
    planId,
    product1Id,
    product2Id,
    product3Id,
  } = req.body;

  const validation = subscriptionsValidation.validate(req.body);
  if (validation.error) {
    res.status(400).send({
      message: validation.error.details[0].message,
    });
    return;
  }

  try {
    const user = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);
    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }

    await connection.query(`
          INSERT INTO subscriptions (user_id, delivery_day_id, plan_id) VALUES ($1, $2, $3);
          `, [user.rows[0].user_id, deliveryDayId, planId]);

    const subscriptions = await connection.query('SELECT * FROM subscriptions WHERE user_id = $1;', [user.rows[0].user_id]);

    if (product1Id) {
      await connection.query(`
          INSERT INTO subscriptions_products (subscription_id, product_id) VALUES ($1, $2);
          `, [subscriptions.rows[0].id, product1Id]);
    }
    if (product2Id) {
      await connection.query(`
          INSERT INTO subscriptions_products (subscription_id, product_id) VALUES ($1, $2);
          `, [subscriptions.rows[0].id, product2Id]);
    }
    if (product3Id) {
      await connection.query(`
        INSERT INTO subscriptions_products (subscription_id, product_id) VALUES ($1, $2);
        `, [subscriptions.rows[0].id, product3Id]);
    }

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function getSubscriptions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    const user = await connection.query('SELECT * FROM sessions WHERE token = $1;', [token]);
    if (user.rowCount === 0) {
      res.sendStatus(401);
      return;
    }

    const subscribers = await connection.query(`
      SELECT subscribers_info.registration_date, subscriptions.user_id, subscriptions.id, delivery_days.name AS delivery_days_name, plans.name AS plans_name
        FROM subscriptions 
        JOIN subscribers_info ON subscribers_info.user_id = subscriptions.user_id 
        JOIN plans ON subscriptions.plan_id = plans.id
        JOIN delivery_days ON subscriptions.delivery_day_id = delivery_days.id
            WHERE subscriptions.user_id = $1;
            `, [user.rows[0].user_id]);

    const products = await connection.query(`
        SELECT products.* FROM products JOIN subscriptions_products ON products.id = subscriptions_products.product_id WHERE subscriptions_products.subscription_id = $1;
    `, [subscribers.rows[0].id]);

    res.send({
      ...subscribers.rows[0],
      products: products.rows,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export {
  postSubscribeInfo,
  postSubscriptions,
  getSubscriptions,
};
