const router = require("express").Router();
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    res.json(await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ message: "Server error." }); }
});

router.patch("/:id/read", async (req, res) => {
  try {
    res.json(await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, { isRead: true }, { new: true }));
  } catch (e) { res.status(500).json({ message: "Server error." }); }
});

module.exports = router;
