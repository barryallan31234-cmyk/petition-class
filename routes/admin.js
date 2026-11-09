const router = require("express").Router();
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth, requireRole("admin"));

router.get("/users", async (req, res) => {
  try {
    res.json(await User.find().select("-passwordHash").sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: "Server error." }); }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "reviewer", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role." });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (e) { res.status(500).json({ message: "Server error." }); }
});

module.exports = router;
