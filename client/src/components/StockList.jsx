import { useState } from 'react';
import axios from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';

export default function StockList({ stocks, userId, onUpdate }) {
  const [stockToRemove, setStockToRemove] = useState(null);

  const handleRemoveStock = async () => {
    try {
      await axios.delete('/api/user/stocks', {
        data: { userId, stock: stockToRemove }
      });
      toast.success(`${stockToRemove} removed from portfolio`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to remove stock');
    } finally {
      setStockToRemove(null);
    }
  };

  return (
    <div className="space-y-2">
      <ConfirmationModal
        isOpen={!!stockToRemove}
        onClose={() => setStockToRemove(null)}
        onConfirm={handleRemoveStock}
        title="Remove Stock"
        message={`Are you sure you want to remove ${stockToRemove} from your portfolio?`}
      />
      
      {stocks.map((stock) => (
        <div key={stock} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">{stock}</span>
          <button
            onClick={() => setStockToRemove(stock)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${stock}`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
      
      {stocks.length === 0 && (
        <p className="text-gray-500 text-center py-4">No stocks in your portfolio</p>
      )}
    </div>
  );
}