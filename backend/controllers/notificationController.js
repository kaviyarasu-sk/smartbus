import Notification from '../models/Notification.js';
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt');
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
export const markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
