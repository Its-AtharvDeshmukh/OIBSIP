import Pizza from '../models/Pizza.js';

// @desc    Update a pizza listing (EDIT)
// @route   PUT /api/admin/menu/:id
// @access  Private/Admin
export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    // Update basic fields
    pizza.name = req.body.name || pizza.name;
    pizza.description = req.body.description || pizza.description;
    pizza.price = req.body.price ? Number(req.body.price) : pizza.price;
    pizza.category = req.body.category || pizza.category;
    
    // Convert string booleans to actual booleans
    if (req.body.isAvailable !== undefined) pizza.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    if (req.body.isFeatured !== undefined) pizza.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;

    // Parse defaultConfig if sent
    if (req.body.defaultConfig) {
      try {
        pizza.defaultConfig = JSON.parse(req.body.defaultConfig);
      } catch (err) {
        console.error('Failed to parse config', err);
      }
    }

    // If a new image was uploaded via Cloudinary/Multer, update the image URL
    if (req.file) {
      pizza.image = req.file.path; // Assuming Cloudinary/Multer attaches the URL to req.file.path
    }

    const updatedPizza = await pizza.save();
    res.status(200).json({ success: true, data: updatedPizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update pizza listing', error: error.message });
  }
};

// @desc    Remove a pizza listing (SOFT DELETE)
// @route   DELETE /api/admin/menu/:id
// @access  Private/Admin
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    // SOFT DELETE: We mark it as deleted and unavailable so it disappears from the storefront,
    // but remains in the database so past customer receipts don't crash.
    pizza.isDeleted = true;
    pizza.isAvailable = false;
    
    await pizza.save();

    res.status(200).json({ success: true, message: 'Pizza safely removed from the menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove pizza', error: error.message });
  }
};