const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) return res.status(400).json({ message: "Username is required!" });
    if (!password) return res.status(400).json({ message: "Password is required!" });

    const user = await User.findOne({ userName: username });
    if (!user)
      return res.status(401).json({ message: "Invalid Username credentials!" });

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password credentials!" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, username: user.userName }
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
