import { useState, useEffect, useCallback } from 'react';
import { 
  getAllCountries, 
  getCountriesByRegion, 
  getCountryByName,
  getCountryByCode 
} from '../api/countriesService';

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all countries
  const fetchAllCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCountries();
      setCountries(data);
      setFilteredCountries(data);
      return data;
    } catch (err) {
      setError('Failed to fetch countries');
      console.error('Error fetching countries:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch countries by region
  const fetchCountriesByRegion = useCallback(async (region) => {
    if (!region) return fetchAllCountries();

    try {
      setLoading(true);
      setError(null);
      const data = await getCountriesByRegion(region);
      setFilteredCountries(data);
      return data;
    } catch (err) {
      setError(`Failed to fetch countries from ${region}`);
      console.error('Error fetching countries by region:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllCountries]);

  // Search countries by name
  const searchCountriesByName = useCallback(async (name) => {
    if (!name.trim()) return fetchAllCountries();

    try {
      setLoading(true);
      setError(null);
      const data = await getCountryByName(name);
      setFilteredCountries(data);
      return data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setFilteredCountries([]);
        setError(`No countries found with name: ${name}`);
      } else {
        setError('Error searching countries');
        console.error('Error searching countries:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllCountries]);

  // Fetch single country by code
  const fetchCountryByCode = useCallback(async (code) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCountryByCode(code);
      return data;
    } catch (err) {
      setError(`Failed to fetch country with code: ${code}`);
      console.error('Error fetching country by code:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize with all countries on mount
  useEffect(() => {
    fetchAllCountries();
  }, [fetchAllCountries]);

  return {
    countries,
    filteredCountries,
    loading,
    error,
    fetchAllCountries,
    fetchCountriesByRegion,
    searchCountriesByName,
    fetchCountryByCode
  };
};

export default useCountries; 