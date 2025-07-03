const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeNews = async (req, res) => {
  try {
    const { newsItem, userStocks } = req.body;

    const prompt = `
Analyze the following stock market news and determine its potential impact on these stocks: ${userStocks.join(', ')}.

News Title: ${newsItem.title}
News Summary: ${newsItem.summary}

Return analysis in this JSON format (no markdown, just raw JSON):
{
  "impact": "Positive/Negative/Neutral",
  "confidence": "Low/Medium/High",
  "reason": "Brief explanation",
  "affectedStocks": ["Array of tickers that are most affected"]
}
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // use gemini-pro or gemini-1.5-pro
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean the Markdown wrapper from Gemini output
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/, '')
      .trim();

    const analysis = JSON.parse(cleaned);
    res.json(analysis);
  } catch (error) {
    console.error('AI analysis error:', error.message || error);
    res.status(500).json({ error: 'Failed to analyze news' });
  }
};
