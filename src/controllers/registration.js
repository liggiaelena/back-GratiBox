import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database.js';
import { singUpValidation, singInValidation } from '../validations/registrationValidation.js';

async function postSingUp(req, res) {
  const {
    name,
    email,
    password,
  } = req.body;

  const { error } = singUpValidation.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.message });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    const emailUnique = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (emailUnique.rowCount !== 0) {
      res.sendStatus(409);
      return;
    }

    await connection.query(`
      INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
      `, [name, email, passwordHash]);

    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function postSingIn(req, res) {
  const {
    email,
    password,
  } = req.body;

  const { error } = singInValidation.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.message });
    return;
  }

  try {
    const user = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
    if (user.rowCount === 0) {
      res.sendStatus(400);
      return;
    }

    const validatePassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!validatePassword) {
      res.sendStatus(401);
      return;
    }

    const token = uuid();
    await connection.query(`
      INSERT INTO sessions (user_id, token) VALUES ($1, $2);
    `, [user.rows[0].id, token]);

    res.send({
      userId: user.rows[0].id,
      name: user.rows[0].name,
      token,
    });
  } catch (e) {
    res.sendStatus(500);
  }
}

export {
  postSingUp,
  postSingIn,
};
