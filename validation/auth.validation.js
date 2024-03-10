
const Joi = require('joi');
const ErrorResponse = require('../utils/error-response.utils');
const moment = require('moment');
const { user_role } = require('../enums/common.enum');

const registerUserSchema = (reqBody) => {
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
    const { value, error } = Joi.object(dataSchema).validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};


const loginUserSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    username: Joi.string().required(),
    password: Joi.string().required()
  };

  return new Promise((resolve, reject) => {
    const { value, error } = Joi.object(dataSchema).validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};


const updateUserDetailsSchema = (reqBody) => {
  const data = reqBody;

  const dataSchema = {
    name: Joi.string(),
    username: Joi.string(),
    email: Joi.string().empty(["", null]).default(null),
    phone_no: Joi.string().empty(["", null]).default(null),
    updated_at: Joi.date().default(moment()),
  };

  return new Promise((resolve, reject) => {
    const { value, error } = Joi.object(dataSchema).validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value)
  })
};


const updatePasswordSchema = (reqBody) => {
  const data = reqBody;

  let dataSchema = {
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  };

  return new Promise((resolve, reject) => {
    const { value, error } = Joi.object(dataSchema).validate(data, { abortEarly: false });
    if (error) reject(new ErrorResponse(error, 400, { name: "JoiValidationError", error }));
    resolve(value);
  })
};

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserDetailsSchema,
  updatePasswordSchema
}