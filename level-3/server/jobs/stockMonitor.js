import cron from 'node-cron';
import InventoryItem from '../models/InventoryItem.js';
import { sendLowStockAlertEmail } from '../services/emailService.js';

const NOTIFICATION_COOLDOWN_HOURS = 4;

export const checkLowStock = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizza.com';
    const cooldownDate = new Date(Date.now() - NOTIFICATION_COOLDOWN_HOURS * 60 * 60 * 1000);

    const lowStockItems = await InventoryItem.find({
      $expr: { $lte: ['$stock', '$threshold'] },
      $or: [
        { lastEmailNotifiedAt: null },
        { lastEmailNotifiedAt: { $lt: cooldownDate } }
      ]
    });

    if (lowStockItems.length === 0) {
      return { triggered: false, count: 0 };
    }

    console.log(`[CRON STOCK MONITOR]: Found ${lowStockItems.length} items below threshold. Dispatching alert email...`);

    await sendLowStockAlertEmail(adminEmail, lowStockItems);

    const now = new Date();
    await InventoryItem.updateMany(
      { _id: { $in: lowStockItems.map((i) => i._id) } },
      { $set: { lastEmailNotifiedAt: now } }
    );

    return { triggered: true, count: lowStockItems.length };
  } catch (error) {
    console.error(`[CRON STOCK MONITOR ERROR]: ${error.message}`);
    return { triggered: false, error: error.message };
  }
};

export const initStockCronJob = () => {
  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON]: Running scheduled inventory stock verification...');
    await checkLowStock();
  });
  console.log('Automated Low-Stock Cron Job Initialized (Schedule: Every 30 minutes).');
};