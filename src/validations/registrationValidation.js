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

const subscribeValidation = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  cep: Joi.string().min(7).required(),
  city: Joi.string().min(3).required(),
  stateId: Joi.number().required(),

});

export {
  singUpValidation,
  singInValidation,
  subscribeValidation,
};
