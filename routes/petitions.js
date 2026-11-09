const router = require("express").Router();
const Petition = require("../models/Petition");
const PetitionStudent = require("../models/PetitionStudent");
const Approval = require("../models/Approval");
const Notification = require("../models/Notification");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth);

const fail = (res, e) => {
  if (e.name === "CastError") return res.status(404).json({ message: "Petition not found." });
  console.error(e);
  res.status(500).json({ message: "Server error." });
};

// Student submits a petition
router.post("/", requireRole("student"), async (req, res) => {
  try {
    const { subjectCode, subjectName, semester, academicYear, reason, students = [] } = req.body;
    if (!subjectCode || !subjectName || !semester || !academicYear || !reason)
      return res.status(400).json({ message: "Fill all required fields." });
    const petition = await Petition.create({
      subjectCode, subjectName, semester, academicYear, reason, requestedBy: req.user.id
    });
    const valid = students.filter(s => s && s.studentName);
    if (valid.length)
      await PetitionStudent.insertMany(valid.map(s => ({ ...s, petitionId: petition._id })));
    res.status(201).json(petition);
  } catch (e) { fail(res, e); }
});

// Student sees their own petitions
router.get("/mine", requireRole("student"), async (req, res) => {
  try {
    res.json(await Petition.find({ requestedBy: req.user.id }).sort({ createdAt: -1 }));
  } catch (e) { fail(res, e); }
});

// Reviewer/admin sees the queue (optional ?status=Pending)
router.get("/", requireRole("reviewer", "admin"), async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    res.json(await Petition.find(filter).populate("requestedBy", "fullName email").sort({ createdAt: -1 }));
  } catch (e) { fail(res, e); }
});

// One petition with its students and review history
router.get("/:id", async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id).populate("requestedBy", "fullName email");
    if (!petition) return res.status(404).json({ message: "Petition not found." });
    if (req.user.role === "student" && String(petition.requestedBy._id) !== req.user.id)
      return res.status(403).json({ message: "Not allowed." });
    const students = await PetitionStudent.find({ petitionId: petition._id });
    const approvals = await Approval.find({ petitionId: petition._id }).sort({ decidedAt: 1 });
    res.json({ petition, students, approvals });
  } catch (e) { fail(res, e); }
});

// Reviewer records a decision
router.post("/:id/decision", requireRole("reviewer"), async (req, res) => {
  try {
    const { decision, comments } = req.body;
    if (!["Under Review", "Returned", "Approved", "Rejected"].includes(decision))
      return res.status(400).json({ message: "Invalid decision." });
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found." });

    await Approval.create({ petitionId: petition._id, reviewerId: req.user.id, decision, comments });
    petition.status = decision;
    await petition.save();
    await Notification.create({
      userId: petition.requestedBy,
      petitionId: petition._id,
      message: `Your petition for ${petition.subjectCode} is now: ${decision}.`
    });
    res.json(petition);
  } catch (e) { fail(res, e); }
});

module.exports = router;
