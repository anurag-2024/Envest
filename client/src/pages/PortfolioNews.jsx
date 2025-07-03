import { useState, useEffect } from 'react';
import axios from '../utils/axiosClient';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NewsCard from '../components/NewsCard';
import { getOrCreateUserId } from '../utils/userId';
import BrokerConnectionModal from '../components/BrokerConnectionModal';
import {
  ArrowPathIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export default function PortfolioNews({ userStocks, onAddStockClick, fetchUserStocks }) {
  const [news, setNews] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBrokerModal, setShowBrokerModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('zerodha_connected') === 'true') {
      toast.success('Zerodha account connected successfully!');
      fetchUserStocks();
    } else if (searchParams.get('groww_connected') === 'true') {
      toast.success('Groww account connected successfully!');
      fetchUserStocks();
    } else if (searchParams.get('zerodha_error') === 'true') {
      toast.error('Failed to connect Zerodha account');
    } else if (searchParams.get('groww_error') === 'true') {
      toast.error('Failed to connect Groww account');
    }
  }, [searchParams, fetchUserStocks]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news/company', {
        params: { symbols: userStocks.join(',') }
      });
      const filteredNews = response.data.filter(item =>
        item.tickers.some(ticker => userStocks.includes(ticker))
      );
      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [userStocks]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const handleBrokerConnect = async (broker, token) => {
    try {
      let endpoint;
      const payload = {};

      if (broker === 'zerodha') {
        endpoint = '/api/broker/zerodha';
        payload.request_token = token;
      } else {
        endpoint = '/api/broker/groww';
        payload.session_token = token;
      }

      const response = await axios.post(endpoint, payload);
      await fetchUserStocks();
      toast.success(`${broker.charAt(0).toUpperCase() + broker.slice(1)} connected successfully!`);
      return true;
    } catch (error) {
      toast.error(`Failed to connect ${broker}`);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio News</h1>
          <p className="mt-1 text-sm text-gray-500">
            News relevant to your investments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            {refreshing ? (
              <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
            ) : (
              <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
            )}
            Refresh
          </button>

          <button
            onClick={() => setShowBrokerModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none cursor-pointer"
          >
            <LinkIcon className="-ml-1 mr-2 h-4 w-4" />
            Connect Broker
          </button>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {userStocks.length} {userStocks.length === 1 ? 'Stock' : 'Stocks'}
          </span>
        </div>
      </div>

      {userStocks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stocks in portfolio</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">
            Connect your broker account or add stocks manually
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowBrokerModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none cursor-pointer"
            >
              <LinkIcon className="-ml-1 mr-2 h-4 w-4" />
              Connect Broker
            </button>
            <button
              onClick={onAddStockClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Add Stocks Manually
            </button>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No news found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>There are currently no news articles related to your portfolio.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard
              key={item.url}
              newsItem={item}
              userStocks={userStocks}
              showAnalysis={true}
            />
          ))}
        </div>
      )}

      <BrokerConnectionModal
        isOpen={showBrokerModal}
        onClose={() => setShowBrokerModal(false)}
      />
    </div>
  );
}
