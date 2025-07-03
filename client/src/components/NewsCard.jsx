// src/components/NewsCard.js
import { useState } from 'react';
import axios from '../utils/axiosClient';
import { toast } from 'react-hot-toast';

export default function NewsCard({ newsItem, userStocks = [], showAnalysis = false }) {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const analyzeNews = async () => {
    try {
      setAnalyzing(true);
      const response = await axios.post('/api/analyze', {
        newsItem,
        userStocks
      });
      setAnalysis(response.data);
      toast.success('Analysis completed');
    } catch (error) {
      console.error('Error analyzing news:', error);
      toast.error('Failed to analyze news');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
              {newsItem.source}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {newsItem.title}
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(newsItem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <p className={`text-gray-600 mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
          {newsItem.summary}
        </p>
        
        {newsItem.tickers.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Related Stocks
            </div>
            <div className="flex flex-wrap gap-2">
              {newsItem.tickers.map((ticker, index) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-xs rounded-full ${
                    userStocks.includes(ticker) 
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
          
          <div className="flex space-x-2">
            <a 
              href={newsItem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Full Story
            </a>
            
            {showAnalysis && (
              <button 
                onClick={analyzeNews}
                disabled={analyzing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-75"
              >
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            )}
          </div>
        </div>
        
        {analysis && (
          <div className={`mt-4 p-4 rounded-lg ${
            analysis.impact === 'Positive' ? 'bg-green-50 border border-green-100' :
            analysis.impact === 'Negative' ? 'bg-red-50 border border-red-100' :
            'bg-blue-50 border border-blue-100'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                analysis.impact === 'Positive' ? 'bg-green-100 text-green-800' :
                analysis.impact === 'Negative' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {analysis.impact} Impact ({analysis.confidence})
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{analysis.reason}</p>
            {analysis.affectedStocks?.length > 0 && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">Affected: </span>
                {analysis.affectedStocks.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}