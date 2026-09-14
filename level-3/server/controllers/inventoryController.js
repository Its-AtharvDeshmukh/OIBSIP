import InventoryItem from '../models/InventoryItem.js';

export const getBuilderIngredients = async (req, res) => {
  try {
    const items = await InventoryItem.find({ stock: { $gt: 0 } }).sort({ price: 1 });

    const grouped = {
      bases: items.filter((item) => item.category === 'base'),
      sauces: items.filter((item) => item.category === 'sauce'),
      cheeses: items.filter((item) => item.category === 'cheese'),
      veggies: items.filter((item) => item.category === 'veggie')
    };

    res.status(200).json({
      success: true,
      totalAvailable: items.length,
      data: grouped,
      raw: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};