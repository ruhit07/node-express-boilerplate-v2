
const Joi = require('joi');
const ErrorResponse = require('../utils/error-response.utils');
const moment = require('moment');
const { user_role } = require('../enums/common.enum');

const createUserSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    name: Joi.string().required(),
    email: Joi.string().empty(["", null]),
    phone_no: Joi.string().empty(["", null]),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(user_role.ADMIN, user_role.USER).required(),
    created_at: Joi.date().default(moment()),
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};


const updateUserSchema = (reqBody) => {
  const data = reqBody;

  const dataSchema = {
    name: Joi.string(),
    email: Joi.string().empty(["", null]).default(null),
    phone_no: Joi.string().empty(["", null]).default(null),
    username: Joi.string(),
    role: Joi.string().valid(user_role.ADMIN, user_role.USER),
    is_active: Joi.boolean(),
    updated_at: Joi.date().default(moment()),
  };

  return new Promise((resolve, reject) => {
    const schema = Joi.object(dataSchema);
    const { value, error } = schema.validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};


module.exports = {
  createUserSchema,
  updateUserSchema,
}