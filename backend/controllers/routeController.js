import Route from '../models/Route.js';
export const getRoutes = async (req, res) => {
  try { const routes = await Route.find(); res.json(routes); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
export const addRoute = async (req, res) => {
  try { const route = await Route.create(req.body); res.status(201).json(route); }
  catch (error) { res.status(400).json({ message: error.message }); }
};
export const deleteRoute = async (req, res) => {
  try { await Route.findByIdAndDelete(req.params.id); res.json({ message: 'Route deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};
