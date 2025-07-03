import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function BrokerConnectionModal({ isOpen, onClose }) {
  const connectZerodha = () => {
    const width = 500, height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const zerodhaAuthUrl = `https://kite.trade/connect/login?api_key=${import.meta.env.REACT_APP_ZERODHA_API_KEY
      }&v=3&redirect_uri=${encodeURIComponent(`${import.meta.env.REACT_APP_BACKEND_URL}/api/zerodha/callback`)
      }`;

    window.open(
      zerodhaAuthUrl,
      'zerodhaAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };


  const connectGroww = () => {
    const width = 500, height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
      `https://api.groww.in/v1/oauth/authorize?client_id=${import.meta.env.REACT_APP_GROW_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(`${import.meta.env.REACT_APP_BACKEND_URL}/api/groww/callback`)
      }&response_type=code&state=demo-user`,
      'growwAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
          <div className="flex justify-between items-center mb-6 cursor-pointer">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Connect Your Broker Account
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-6 w-6 cursor-pointer" />
            </button>
          </div>

          <div className="space-y-4 cursor-pointer">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <button
                onClick={connectZerodha}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src="https://zerodha.com/static/images/logo.svg"
                    alt="Zerodha"
                    className="h-8 mr-3"
                  />
                  <span className="font-medium">Connect with Zerodha</span>
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
              <button
                onClick={connectGroww}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src="https://groww.in/favicon.ico"
                    alt="Groww"
                    className="h-8 mr-3"
                  />
                  <span className="font-medium">Connect with Groww</span>
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>You'll be redirected to your broker's secure login page to authorize access. (You can add stock manually if not working)</p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}