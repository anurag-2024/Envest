import { useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getOrCreateUserId } from '../utils/userId';
import StockList from '../components/StockList';

export default function ManageStocks({ fetchUserStocks, userStocks }) {
  const userId = getOrCreateUserId();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserStocks();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Your Stocks</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-4">
        <StockList 
          stocks={userStocks} 
          userId={userId} 
          onUpdate={fetchUserStocks} 
        />
      </div>
    </div>
  );
}
