// Palette-matched category colors — mint-to-butter-yellow family,
// each category gets a tint from the same warm vintage palette.
export const CATEGORY_COLORS = {
  Fashion: { bg: '#FADA5D', text: '#6B5410' },
  Kitchen: { bg: '#FAFAD2', text: '#7A6A00' },
  'Yard & Home': { bg: '#91F3D3', text: '#1B6E56' },
  Electronics: { bg: '#F5EC76', text: '#6B5E00' },
  Books: { bg: '#FADA5D', text: '#6B5410' },
  Other: { bg: '#FAFAD2', text: '#7A6A00' },
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS);