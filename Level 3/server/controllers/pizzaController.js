import Pizza from '../models/Pizza.js';

// @desc   Get all available menu pizzas
// @route  GET /api/pizzas
export const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.status(200).json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single pizza by ID
// @route  GET /api/pizzas/:id
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};