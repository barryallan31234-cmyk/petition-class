const mongoose = require("mongoose");
module.exports = mongoose.model("Notification", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  petitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Petition" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true }));
