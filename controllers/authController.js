const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const signToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.signup = async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Check if email & password exist
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  // 2️⃣ Find user and explicitly select password
  const user = await User.findOne({ email }).select("+password");

  // 3️⃣ Check if user exists & password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }

  // 4️⃣ Generate token
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
};
