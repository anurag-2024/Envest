// src/App.js
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from './utils/axiosClient';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GeneralNews from './pages/GeneralNews';
import PortfolioNews from './pages/PortfolioNews';
import AddStockModal from './components/AddStockModal';
import ManageStocks from './pages/ManageStocks';
import { getOrCreateUserId } from './utils/userId';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userStocks, setUserStocks] = useState([]);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [showManageStocks, setShowManageStocks] = useState(false);

  const userId = getOrCreateUserId();

  const fetchUserStocks = async () => {
    try {
      const response = await axios.get('/api/user/stocks', { params: { userId } });
      setUserStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleAddStock = async (stock) => {
    try {
      await axios.post('/api/user/stocks', { stock, userId });
      await fetchUserStocks();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  useEffect(() => {
    fetchUserStocks();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onAddStockClick={() => setIsAddStockOpen(true)}
        onManageStocksClick={() => navigate('/manage-stocks')}
      />

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddStock={handleAddStock}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<GeneralNews />} />
              <Route
                path="/manage-stocks"
                element={
                  <ManageStocks
                    fetchUserStocks={fetchUserStocks}
                    userStocks={userStocks}
                  />
                }
              />
              <Route
                path="/portfolio"
                element={
                  <PortfolioNews
                    userStocks={userStocks}
                    onAddStockClick={() => setIsAddStockOpen(true)}
                    fetchUserStocks={fetchUserStocks}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;