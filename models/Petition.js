const mongoose = require("mongoose");
const petitionSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true },
  reason: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Returned", "Approved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });
module.exports = mongoose.model("Petition", petitionSchema);
