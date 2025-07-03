
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors mr-4"
          >
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <UserCircleIcon className="h-9 w-9 text-gray-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}