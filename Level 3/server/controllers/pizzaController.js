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

// @desc   Create a new menu pizza
// @route  POST /api/pizzas
// @access Private/Admin
export const createPizza = async (req, res) => {
  try {
    const { name, description, price, image, defaultConfig } = req.body;
    
    const pizza = await Pizza.create({
      name,
      description,
      price,
      image,
      defaultConfig
    });

    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a pizza
// @route  DELETE /api/pizzas/:id
// @access Private/Admin
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    await pizza.deleteOne();
    res.status(200).json({ success: true, message: 'Pizza removed from menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};