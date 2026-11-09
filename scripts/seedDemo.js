// Run once: node scripts/seedDemo.js
// Creates (or resets) the demo accounts used for the presentation.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const accounts = [
  { fullName: "System Admin",     email: "admin@example.com",    password: "ChangeMe123!",  role: "admin" },
  { fullName: "Demo Reviewer",    email: "reviewer@example.com", password: "Reviewer123!",  role: "reviewer" },
  { fullName: "Demo Student",     email: "student@example.com",  password: "Student123!",   role: "student" }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const a of accounts) {
    await User.findOneAndUpdate(
      { email: a.email },
      { fullName: a.fullName, role: a.role, passwordHash: await bcrypt.hash(a.password, 10),
        failedLogins: 0, lockUntil: undefined },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`${a.role.padEnd(9)} ${a.email} / ${a.password}`);
  }
  process.exit();
})();
