import { Dialog } from '@headlessui/react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
          <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-6">
            {message}
          </Dialog.Description>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}