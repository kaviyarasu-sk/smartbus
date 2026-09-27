import Complaint from '../models/Complaint.js';
export const getComplaints = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'STUDENT') query.student = req.user._id;
    const complaints = await Complaint.find(query).populate('student', 'name email').sort('-createdAt');
    res.json(complaints);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({ ...req.body, student: req.user._id });
    res.status(201).json(complaint);
  } catch (error) { res.status(400).json({ message: error.message }); }
};
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(complaint);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
