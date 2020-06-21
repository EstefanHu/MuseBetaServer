const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

exports.getAuthorized = async (req, res) => {
  try {
    const response = req.body.type === 'login' ?
      await login(req.body.payload)
      : await register(req.body.payload);

    if (response.status === 422)
      return res.status(response.status).json({
        status: 'failure',
        payload: response.payload
      });

    const token = jwt.sign({ userId: response.payload }, process.env.JWT_KEY, {expiresIn: '1d'});
    res.status(response.status).json({ status: 'success', payload: token });
  } catch (error) {
    res.status(500).json({ status: 'failure', payload: error });
  };
};

const login = async payload => {
  const { email, password } = payload;
  if (!email || !password)
    return {
      status: 422,
      payload: 'Must provide email and password'
    };

  let user = await User.findOne({ email });
  if (!user)
    return {
      status: 422,
      payload: 'Email or Password was incorrect'
    };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return {
      status: 422,
      payload: 'Email or Password was incorrect'
    };

  return { status: 200, payload: user._id };
}

const register = async payload => {
  const { firstName, lastName, email, password } = payload;

  let checkIfUserExist = await User.findOne({ email });
  if (checkIfUserExist)
    return {
      status: 422,
      payload: 'Email already in use'
    };

  if (password < 8)
    return {
      status: 422,
      payload: 'Password is not long enough'
    };

  let user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = password;
  user = await user.save();

  return { status: 201, payload: user._id };
}