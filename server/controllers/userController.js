const User = require('../models/userModel');

exports.addStockToUser = async (req, res) => {
  try {
    const { stock, userId } = req.body; 
    
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({
        userId,
        stocks: [stock],
        createdAt: new Date()
      });
    } else if (!user.stocks.includes(stock)) {
      user.stocks.push(stock);
    }
    
    await user.save();
    res.json(user.stocks);
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Failed to add stock' });
  }
};

exports.getUserStocks = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ userId });
    res.json(user?.stocks || []);
  } catch (error) {
    console.error('Error getting user stocks:', error);
    res.status(500).json({ error: 'Failed to get user stocks' });
  }
};

exports.removeStockFromUser = async (req, res) => {
  try {
    const { userId, stock } = req.body;
    
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.stocks = user.stocks.filter(s => s !== stock);
    await user.save();
    
    res.json(user.stocks);
  } catch (error) {
    console.error('Error removing stock:', error);
    res.status(500).json({ error: 'Failed to remove stock' });
  }
};