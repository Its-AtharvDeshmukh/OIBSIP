import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import InventoryItem from './models/InventoryItem.js';
import Pizza from './models/Pizza.js';
import Admin from './models/Admin.js';

dotenv.config();

const inventoryItems = [
  // 5 Pizza Bases (Step 1 of Custom Builder)
  { name: 'Classic Hand Tossed', category: 'base', stock: 60, threshold: 20, price: 120 },
  { name: 'Thin Crust', category: 'base', stock: 50, threshold: 20, price: 140 },
  { name: 'Cheese Burst Crust', category: 'base', stock: 45, threshold: 20, price: 190 },
  { name: 'Whole Wheat Crust', category: 'base', stock: 40, threshold: 20, price: 150 },
  { name: 'Gluten-Free Herb Crust', category: 'base', stock: 35, threshold: 20, price: 210 },

  // 5 Sauces (Step 2 of Custom Builder)
  { name: 'Classic Marinara', category: 'sauce', stock: 70, threshold: 20, price: 30 },
  { name: 'Spicy Red Pepper', category: 'sauce', stock: 60, threshold: 20, price: 40 },
  { name: 'Creamy Garlic Alfredo', category: 'sauce', stock: 50, threshold: 20, price: 50 },
  { name: 'Smoky Chipotle Barbeque', category: 'sauce', stock: 55, threshold: 20, price: 45 },
  { name: 'Zesty Basil Pesto', category: 'sauce', stock: 40, threshold: 20, price: 60 },

  // Cheeses (Step 3 of Custom Builder)
  { name: 'Fresh Mozzarella', category: 'cheese', stock: 80, threshold: 20, price: 60 },
  { name: 'Sharp Cheddar', category: 'cheese', stock: 65, threshold: 20, price: 70 },
  { name: 'Gouda Blend', category: 'cheese', stock: 45, threshold: 20, price: 85 },
  { name: 'Plant-Based Vegan Cheese', category: 'cheese', stock: 35, threshold: 20, price: 95 },

  // Vegetables (Step 4 of Custom Builder - Multi-Selection)
  { name: 'Crisp Bell Peppers', category: 'veggie', stock: 90, threshold: 20, price: 30 },
  { name: 'Sliced Button Mushrooms', category: 'veggie', stock: 85, threshold: 20, price: 40 },
  { name: 'Red Onions', category: 'veggie', stock: 100, threshold: 20, price: 25 },
  { name: 'Spanish Black Olives', category: 'veggie', stock: 75, threshold: 20, price: 45 },
  { name: 'Pickled Jalapeños', category: 'veggie', stock: 70, threshold: 20, price: 35 },
  { name: 'Golden Sweet Corn', category: 'veggie', stock: 80, threshold: 20, price: 30 },
  { name: 'Baby Spinach & Cherry Tomatoes', category: 'veggie', stock: 60, threshold: 20, price: 40 }
];

const preconfiguredPizzas = [
  {
    name: 'Margherita Fresca',
    description: 'Fresh mozzarella, classic marinara sauce, fresh basil, and extra virgin olive oil drizzle.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    defaultConfig: {
      base: 'Classic Hand Tossed',
      sauce: 'Classic Marinara',
      cheese: 'Fresh Mozzarella',
      veggies: ['Baby Spinach & Cherry Tomatoes']
    }
  },
  {
    name: 'Garden Harvest Veggie',
    description: 'Crisp bell peppers, button mushrooms, red onions, sweet corn, and creamy alfredo.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    defaultConfig: {
      base: 'Thin Crust',
      sauce: 'Creamy Garlic Alfredo',
      cheese: 'Sharp Cheddar',
      veggies: ['Crisp Bell Peppers', 'Sliced Button Mushrooms', 'Golden Sweet Corn']
    }
  },
  {
    name: 'Fiery Jalapeño Crunch',
    description: 'Spicy red pepper sauce, pickled jalapeños, black olives, red onions, and melted mozzarella.',
    price: 379,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
    defaultConfig: {
      base: 'Classic Hand Tossed',
      sauce: 'Spicy Red Pepper',
      cheese: 'Fresh Mozzarella',
      veggies: ['Pickled Jalapeños', 'Spanish Black Olives', 'Red Onions']
    }
  },
  {
    name: 'Smoky Barbeque Supreme',
    description: 'Smoky chipotle sauce, cheddar blend, charred peppers, and corn on whole wheat crust.',
    price: 419,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    defaultConfig: {
      base: 'Whole Wheat Crust',
      sauce: 'Smoky Chipotle Barbeque',
      cheese: 'Sharp Cheddar',
      veggies: ['Crisp Bell Peppers', 'Golden Sweet Corn']
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing records
    await InventoryItem.deleteMany({});
    await Pizza.deleteMany({});
    await Admin.deleteMany({});

    // 1. Seed Inventory
    await InventoryItem.insertMany(inventoryItems);
    console.log(`Seeded ${inventoryItems.length} Inventory Items.`);

    // 2. Seed Pre-configured Menu Pizzas
    await Pizza.insertMany(preconfiguredPizzas);
    console.log(`Seeded ${preconfiguredPizzas.length} Menu Pizzas.`);

    // 3. Seed Master Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizza.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@123';

    await Admin.create({
      name: 'Executive Head Chef',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log(`Seeded Master Admin (${adminEmail}).`);

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();