export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-[-60px] mx-auto flex max-w-sm items-center space-x-2 rounded-md bg-green-50 p-4 shadow-lg">
      <div className="text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m-6 8a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
      </div>
      <p className="text-sm text-green-800">{message}</p>
      <button
        onClick={onClose}
        className="text-green-600 hover:text-green-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}