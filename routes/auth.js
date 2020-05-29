const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');


//Validation


router.post('/register', async (req, res) => {

  // Validate the DATA before we create the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user is already in DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email is Already taken');

  // HASH the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id })
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {

  // Validate the DATA before we create the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email is not found');
  //If password is correct/valid
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Invalid Password');

  // Create and assign JWT
  const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;