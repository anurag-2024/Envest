const axios = require('axios');
const User = require('../models/userModel');
const crypto = require('crypto');

function generateChecksum(apiKey, requestToken, apiSecret) {
  return crypto
    .createHash('sha256')
    .update(`${apiKey}${requestToken}${apiSecret}`)
    .digest('hex');
}

// Zerodha Kite Connect integration
exports.connectZerodha = async (req, res) => {
  try {
    const { request_token } = req.body;
    
    // Exchange request token for access token
    const response = await axios.post('https://api.kite.trade/session/token', {
      api_key: process.env.ZERODHA_API_KEY,
      request_token,
      checksum: generateChecksum(request_token) // Implement this based on Zerodha docs
    });

    const { access_token } = response.data;
    
    // Fetch holdings from Zerodha
    const holdings = await axios.get('https://api.kite.trade/portfolio/holdings', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${process.env.ZERODHA_API_KEY}:${access_token}`
      }
    });

    // Save to user's portfolio
    const stocks = holdings.data.map(h => h.tradingsymbol);
    await User.updateOne(
      { userId: req.user.userId }, 
      { $set: { zerodhaAccessToken: access_token, stocks } }
    );

    res.json({ success: true, stocks });
  } catch (error) {
    console.error('Zerodha connection error:', error);
    res.status(500).json({ error: 'Failed to connect Zerodha' });
  }
};

// Groww integration
exports.connectGroww = async (req, res) => {
  try {
    const { session_token } = req.body;
    
    // Fetch holdings from Groww
    const response = await axios.get('https://api.groww.in/v1/portfolio/holdings', {
      headers: {
        'Authorization': `Bearer ${session_token}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract stocks from holdings
    const stocks = response.data.holdings
      .filter(h => h.instrument_type === 'EQUITY')
      .map(h => h.tradingsymbol);

    // Save to user's portfolio
    await User.updateOne(
      { userId: req.user.userId },
      { $set: { growwSessionToken: session_token, stocks } }
    );

    res.json({ success: true, stocks });
  } catch (error) {
    console.error('Groww connection error:', error);
    res.status(500).json({ error: 'Failed to connect Groww' });
  }
};

// Get portfolio holdings
exports.getHoldings = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    res.json(user?.stocks || []);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
};