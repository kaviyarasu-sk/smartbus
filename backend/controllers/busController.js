import Bus from '../models/Bus.js';

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('driver route');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    const populatedBus = await Bus.findById(bus._id).populate('driver route');
    res.status(201).json(populatedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('driver route');
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
