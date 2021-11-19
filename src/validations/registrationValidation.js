import Joi from 'joi';

const singUpValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const singInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export {
  singUpValidation,
  singInValidation,
};
