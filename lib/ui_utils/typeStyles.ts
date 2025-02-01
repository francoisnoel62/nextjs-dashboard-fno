import { getClassTypes } from '@/lib/data';

// Define a set of color combinations we can cycle through
const COLOR_SCHEMES = [
  {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-400'
  },
  {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-400'
  },
  {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-400'
  },
  {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-400'
  },
  {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-400'
  },
  {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-400'
  },
  {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-400'
  },
  // Add more color schemes as needed
];

type TypeStyleMapping = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
};

let TYPE_STYLES: TypeStyleMapping = {};

// Initialize the type styles
export async function initializeTypeStyles() {
  try {
    const types = await getClassTypes();
    TYPE_STYLES = types.reduce((acc, type, index) => {
      const colorScheme = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
      acc[type.type] = colorScheme;
      return acc;
    }, {} as TypeStyleMapping);
    
    // Add default 'all' type if it doesn't exist
    if (!TYPE_STYLES['all']) {
      TYPE_STYLES['all'] = COLOR_SCHEMES[COLOR_SCHEMES.length - 1];
    }
  } catch (error) {
    console.error('Failed to initialize type styles:', error);
    // Fallback to basic styling if initialization fails
    TYPE_STYLES = {
      'all': COLOR_SCHEMES[0]
    };
  }
}

export function getTypeStyles(type: string) {
  const defaultStyle = TYPE_STYLES['all'] || COLOR_SCHEMES[0];
  const style = TYPE_STYLES[type] || defaultStyle;
  return `${style.bg} ${style.text} ${style.border}`;
} 