import { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axiosClient';
import { toast } from 'react-hot-toast';

export default function AddStockModal({ isOpen, onClose, onAddStock }) {
  const [stock, setStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/stocks/search?q=${query}`);
      console.log('Suggestions fetched:', data);
      setSuggestions(data.result || []);
    } catch (err) {
      console.error('Error fetching suggestions', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (stock.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(stock.trim());
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [stock]);

  const handleSuggestionClick = (symbol) => {
    setStock(symbol);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = stock.trim().toUpperCase();
    if (trimmed) {
      try {
        setSubmitting(true);
        await onAddStock(trimmed);
        toast.success(`Stock ${trimmed} added successfully!`);
        setStock('');
        setSuggestions([]);
      } finally {
        setSubmitting(false);
      }
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Stock Symbol</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Symbol
            </label>
            <input
              type="text"
              id="stock"
              name="stock"
              placeholder="e.g., AAPL, MSFT"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-md w-full shadow-lg max-h-56 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionClick(item.symbol)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    <span className="font-medium">{item.symbol}</span> — {item.description || item.name}
                  </li>
                ))}
              </ul>
            )}

            {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </span>
              ) : (
                'Add Stock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
