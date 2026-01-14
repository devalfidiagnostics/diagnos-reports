const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ userName: email });
    if (!user)
      return res.status(401).json({ message: "Invalid User credentials" });

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
