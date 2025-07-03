import { NavLink } from 'react-router-dom';
import { 
  NewspaperIcon,
  ChartBarIcon,
  PlusCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, toggleSidebar, onAddStockClick, onManageStocksClick }) {
  return (
    <div className={`fixed h-full bg-white shadow-lg z-10 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {isOpen ? (
            <h2 className="text-xl font-semibold text-gray-800">Stock Insights</h2>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-xs font-medium text-white">SI</span>
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ArrowLeftIcon className="h-5 w-5" />
            ) : (
              <ArrowRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <NewspaperIcon className="h-5 w-5" />
                {isOpen && <span className="ml-3">General News</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/portfolio"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <ChartBarIcon className="h-5 w-5" />
                {isOpen && <span className="ml-3">Portfolio News</span>}
              </NavLink>
            </li>
            <li>
              <button
                className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-colors cursor-pointer"
                onClick={onAddStockClick}
              >
                <PlusCircleIcon className="h-5 w-5" />
                {isOpen && <span className="ml-3">Add Stocks</span>}
              </button>
            </li>
            <li>
              <button
                className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-colors cursor-pointer"
                onClick={onManageStocksClick}
              >
                <TrashIcon className="h-5 w-5" />
                {isOpen && <span className="ml-3">Manage Stocks</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}