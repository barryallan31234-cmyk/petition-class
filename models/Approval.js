const mongoose = require("mongoose");
module.exports = mongoose.model("Approval", new mongoose.Schema({
  petitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Petition", required: true, index: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stage: { type: Number, default: 1 },
  decision: { type: String, enum: ["Under Review", "Returned", "Approved", "Rejected"], required: true },
  comments: String,
  decidedAt: { type: Date, default: Date.now }
}));
