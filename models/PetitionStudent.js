const mongoose = require("mongoose");
module.exports = mongoose.model("PetitionStudent", new mongoose.Schema({
  petitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Petition", required: true, index: true },
  studentId: String,
  studentName: { type: String, required: true },
  program: String,
  yearLevel: Number
}));
