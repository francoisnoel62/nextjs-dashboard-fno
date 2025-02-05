import { fetchTypes } from "@/src/applications/actions/classes/classes";

interface TypeStyleMapping {
    bg: string;
    text: string;
    border: string;
}

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
    }
];

let TYPE_STYLES: Record<string, TypeStyleMapping> = {};

export async function initializeTypeStyles() {
    const types = await fetchTypes();
    types.forEach((type, index) => {
        TYPE_STYLES[type.type_name] = COLOR_SCHEMES[index % COLOR_SCHEMES.length];
    });
}

export function getTypeStyles(type: string | undefined): TypeStyleMapping {
    if (!type) return COLOR_SCHEMES[0];
    return TYPE_STYLES[type] || COLOR_SCHEMES[0];
}