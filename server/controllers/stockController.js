// /controllers/stockController.js
const axios = require('axios');

exports.searchStocks = async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/search`, {
      params: {
        q: query
      },
      headers: {
        'X-Finnhub-Token': process.env.FINNHUB_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Stock search error:', error);
    res.status(500).json({ error: 'Stock search failed' });
  }
};
