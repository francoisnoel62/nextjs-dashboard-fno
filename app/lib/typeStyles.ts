type TypeStyleMapping = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
  };
};

const TYPE_STYLES: TypeStyleMapping = {
  'adults': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-400'
  },
  'adults&teens': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-400'
  },
  'kids': {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-400'
  },
  'teens': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-400'
  },
  'all': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-400'
  }
};

export function getTypeStyles(type: string) {
  const defaultStyle = TYPE_STYLES['all'];
  const style = TYPE_STYLES[type] || defaultStyle;
  return `${style.bg} ${style.text} ${style.border}`;
} 