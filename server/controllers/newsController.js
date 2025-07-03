const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

exports.getMarketNews = async (req, res) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/news`, {
      params: {
        category: 'general',
        token: FINNHUB_API_KEY,
      }
    });
// console.log('Fetched news:', response.data);
    const news = response.data.map(item => ({
      id: item.id,
      title: item.headline,
      summary: item.summary,
      time: item.datetime * 1000,
      source: item.source,
      url: item.url,
      tickers: item.related?.split(',') || [],
    }));

    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};


exports.getCompanyMarketNews = async (req, res) => {
  try {
    const symbols = req.query.symbols?.split(',') || [];
    if (symbols.length === 0) {
      return res.status(400).json({ error: 'No symbols provided' });
    }

    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 2); // last 2 days

    const format = (date) => date.toISOString().split('T')[0];

    // Fetch company news for each symbol in parallel
    const newsPromises = symbols.map(symbol =>
      axios.get(`https://finnhub.io/api/v1/company-news`, {
        params: {
          symbol,
          from: format(from),
          to: format(today),
          token: FINNHUB_API_KEY
        }
      }).then(res => res.data.map(item => ({
        id: `${symbol}-${item.id}`,
        title: item.headline,
        summary: item.summary,
        time: item.datetime * 1000,
        source: item.source,
        url: item.url,
        tickers: [symbol]
      }))).catch(() => []) // fail-safe per symbol
    );

    const results = await Promise.all(newsPromises);
    const mergedNews = results.flat();

    res.json(mergedNews);
  } catch (error) {
    console.error('Error fetching company news:', error);
    res.status(500).json({ error: 'Failed to fetch company news' });
  }
};
