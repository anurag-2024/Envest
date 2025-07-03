require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const { analyzeNews } = require('./controllers/aiController');
const { getMarketNews, getCompanyMarketNews } = require('./controllers/newsController');
const { addStockToUser, getUserStocks, removeStockFromUser } = require('./controllers/userController');
const {searchStocks} =require('./controllers/stockController')
const { connectZerodha, connectGroww,getHoldings } = require('./controllers/brokerController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('tiny'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/userModel');

// Helper function for Zerodha checksum
function generateZerodhaChecksum(requestToken) {
  return crypto
    .createHmac('sha256', process.env.ZERODHA_API_SECRET)
    .update(`${process.env.ZERODHA_API_KEY}${requestToken}`)
    .digest('hex');
}

// Zerodha OAuth callback
app.get('/api/zerodha/callback', async (req, res) => {
  try {
    const { request_token: requestToken } = req.query;
    const userId = req.query.user_id || 'demo-user'; // In production, use actual user ID

    // Exchange request token for access token
    const response = await axios.post('https://api.kite.trade/session/token', {
      api_key: process.env.ZERODHA_API_KEY,
      request_token: requestToken,
      checksum: generateZerodhaChecksum(requestToken)
    });

    const { access_token: accessToken } = response.data;

    // Fetch holdings from Zerodha
    const holdingsResponse = await axios.get('https://api.kite.trade/portfolio/holdings', {
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${process.env.ZERODHA_API_KEY}:${accessToken}`
      }
    });

    // Extract stock symbols
    const stocks = holdingsResponse.data.map(h => h.tradingsymbol);

    // Save to user's account
    await User.findOneAndUpdate(
      { userId },
      { 
        zerodhaAccessToken: accessToken,
        stocks,
        lastSync: new Date() 
      },
      { upsert: true, new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/portfolio?zerodha_connected=true`);
  } catch (error) {
    console.error('Zerodha callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/portfolio?zerodha_error=true`);
  }
});

// Groww OAuth callback
app.get('/api/groww/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.query.state || 'demo-user'; // In production, use actual user ID

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://api.groww.in/v1/oauth/token', {
      client_id: process.env.GROW_CLIENT_ID,
      client_secret: process.env.GROW_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.BACKEND_URL}/api/groww/callback`
    });

    const { access_token: accessToken } = tokenResponse.data;

    // Fetch holdings from Groww
    const holdingsResponse = await axios.get('https://api.groww.in/v1/portfolio/holdings', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract stock symbols
    const stocks = holdingsResponse.data.holdings
      .filter(h => h.instrument_type === 'EQUITY')
      .map(h => h.tradingsymbol);

    // Save to user's account
    await User.findOneAndUpdate(
      { userId },
      { 
        growwAccessToken: accessToken,
        stocks,
        lastSync: new Date() 
      },
      { upsert: true, new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/portfolio?groww_connected=true`);
  } catch (error) {
    console.error('Groww callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/portfolio?groww_error=true`);
  }
});

app.get('/api/news', getMarketNews);
app.get('/api/news/company', getCompanyMarketNews);
app.post('/api/analyze', analyzeNews);
app.post('/api/user/stocks', addStockToUser);
app.delete('/api/user/stocks', removeStockFromUser);
app.get('/api/user/stocks', getUserStocks);
app.get('/api/stocks/search',searchStocks)
app.post('/api/broker/zerodha', connectZerodha);
app.post('/api/broker/groww', connectGroww);
app.get('/api/portfolio/holdings', getHoldings);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));