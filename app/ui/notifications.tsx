import {
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const isAlreadyAttending = message === 'You are already attending this class';
  
  return (
    <div className={`absolute left-0 right-0 top-[-60px] mx-auto flex max-w-sm items-center space-x-2 rounded-md p-4 shadow-lg ${
      isAlreadyAttending ? 'bg-orange-100' : 'bg-green-100'
    }`}>
      <div className={isAlreadyAttending ? 'text-orange-600' : 'text-green-600'}>
        {isAlreadyAttending ? ( 
          <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
        ) : (
          <DocumentCheckIcon className="h-6 w-6 text-green-500" />
        )}
      </div>
      <p className={`text-sm ${isAlreadyAttending ? 'text-orange-800' : 'text-green-800'}`}>{message}</p>
      <button
        onClick={onClose}
        className={`${isAlreadyAttending ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'} focus:outline-none`}
      >
      </button>
    </div>
  );
}