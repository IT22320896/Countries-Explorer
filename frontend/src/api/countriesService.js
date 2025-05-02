import axios from "axios";

const API_URL = "https://restcountries.com/v3.1";

// Get all countries with basic info
export const getAllCountries = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/all?fields=name,population,region,capital,flags,cca3,languages`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

// Get country by name
export const getCountryByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country by name (${name}):`, error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${API_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching countries by region (${region}):`, error);
    throw error;
  }
};

// Get countries by language
export const getCountriesByLanguage = async (language) => {
  try {
    // The REST Countries API doesn't have a direct endpoint for filtering by language,
    // so we'll fetch all countries and filter them on the client side
    const response = await axios.get(`${API_URL}/all`);
    const countries = response.data;

    return countries.filter((country) => {
      if (!country.languages) return false;
      return Object.values(country.languages).some((lang) =>
        lang.toLowerCase().includes(language.toLowerCase())
      );
    });
  } catch (error) {
    console.error(`Error fetching countries by language (${language}):`, error);
    throw error;
  }
};

// Get country details by code
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching country by code (${code}):`, error);
    throw error;
  }
};
