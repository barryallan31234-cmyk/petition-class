const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password || password.length < 8)
      return res.status(400).json({ message: "Fill all fields. Password needs 8+ characters." });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "Email already registered." });
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, passwordHash }); // role defaults to student
    res.status(201).json({ message: "Account created." });
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const bad = () => res.status(401).json({ message: "Invalid email or password." });
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return bad();
    if (user.lockUntil && user.lockUntil > Date.now())
      return res.status(423).json({ message: "Account locked. Try again in a few minutes." });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) {
      user.failedLogins += 1;
      if (user.failedLogins >= 5) { user.lockUntil = Date.now() + 15 * 60 * 1000; user.failedLogins = 0; }
      await user.save();
      return bad();
    }
    user.failedLogins = 0; user.lockUntil = undefined; await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
