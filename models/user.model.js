const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const { Sequelize, sequelize } = require('../config/db');

const User = sequelize.define('users', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Name can not be null" },
      notEmpty: { msg: "Name can not be empty" },
    },
  },
  email: Sequelize.STRING,
  phone_no: Sequelize.STRING,
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Username can not be null" },
      notEmpty: { msg: "Username can not be empty" },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Password can not be null" },
      notEmpty: { msg: "Password can not be empty" },
      len: {
        min: 6,
        msg: "At least 6 character long"
      }
    }
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Role can not be null" },
      notEmpty: { msg: "Role can not be empty" },
    },
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
},
  {
    defaultScope: {
      attributes: {
        exclude: [
          'password',
          "created_at",
          "updated_at"
        ]
      }
    }
  })

// Encrypt password using bcrypt
User.beforeSave(async user => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
})

// Sign JWT and return
User.prototype.getSignedJwtToken = function () {
  return jwt.sign({
    id: this.id,
  }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES // in days 
  });
};

// Match user entered password to hashed password in database
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;