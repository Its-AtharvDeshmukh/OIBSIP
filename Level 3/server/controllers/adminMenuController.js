import Pizza from '../models/Pizza.js';
import { cloudinary } from '../config/cloudinary.js';

const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(buffer);
  });
};

export const getAdminMenu = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu' });
  }
};

export const createMenuPizza = async (req, res) => {
  try {
    let imageUrl = req.body.image || '';
    let imagePublicId = '';

    if (req.file) {
      const result = await streamUpload(req.file.buffer, 'pizza-craft/menu');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } else if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image file or URL is required' });
    }

    const pizza = await Pizza.create({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      isAvailable: req.body.isAvailable === 'true',
      isFeatured: req.body.isFeatured === 'true',
      image: imageUrl,
      imagePublicId,
      defaultConfig: req.body.defaultConfig ? JSON.parse(req.body.defaultConfig) : {}
    });

    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenuPizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });

    let imageUrl = pizza.image;
    let imagePublicId = pizza.imagePublicId;

    if (req.file) {
      const result = await streamUpload(req.file.buffer, 'pizza-craft/menu');
      imageUrl = result.secure_url;
      
      if (pizza.imagePublicId) {
        await cloudinary.uploader.destroy(pizza.imagePublicId);
      }
      imagePublicId = result.public_id;
    }

    pizza.name = req.body.name || pizza.name;
    pizza.description = req.body.description || pizza.description;
    pizza.price = req.body.price ? Number(req.body.price) : pizza.price;
    pizza.category = req.body.category || pizza.category;
    pizza.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : pizza.isAvailable;
    pizza.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured === 'true' : pizza.isFeatured;
    pizza.image = imageUrl;
    pizza.imagePublicId = imagePublicId;
    if (req.body.defaultConfig) pizza.defaultConfig = JSON.parse(req.body.defaultConfig);

    await pizza.save();
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const softDeletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });

    pizza.isDeleted = true;
    pizza.isAvailable = false;
    await pizza.save();

    res.status(200).json({ success: true, message: 'Pizza removed from public menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};