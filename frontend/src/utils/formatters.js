// Format population with commas for thousands
export const formatPopulation = (population) => {
  return population?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'N/A';
};

// Extract languages as an array
export const extractLanguages = (languages) => {
  if (!languages) return ['N/A'];
  return Object.values(languages);
};

// Format array values to comma-separated string
export const formatArrayToString = (arr) => {
  if (!arr || arr.length === 0) return 'N/A';
  return arr.join(', ');
};

// Extract country name
export const getCountryName = (country) => {
  if (!country || !country.name) return 'Unknown';
  return country.name.common || country.name.official || 'Unknown';
};

// Get capital city
export const getCapital = (country) => {
  if (!country || !country.capital || country.capital.length === 0) return 'N/A';
  return country.capital[0];
};

// Get region and subregion
export const getRegionInfo = (country) => {
  const region = country?.region || 'N/A';
  const subregion = country?.subregion ? `, ${country.subregion}` : '';
  return `${region}${subregion}`;
}; 