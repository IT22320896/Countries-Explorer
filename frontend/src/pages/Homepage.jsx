import { useState, useEffect, useCallback, useContext } from "react";
import {
  getAllCountries,
  getCountriesByRegion,
  getCountryByName,
  getCountriesByLanguage,
} from "../api/countriesService";
import { getFavorites } from "../api/favoritesService";
import { AuthContext } from "../context/AuthContext";
import SearchFilter from "../components/SearchFilter";
import CountryList from "../components/CountryList";

const Homepage = ({ showFavorites = false }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);

  // Fetch all countries
  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCountries();
      setCountries(data);
      setFilteredCountries(data);
    } catch (err) {
      setError("Failed to fetch countries. Please try again later.");
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await getFavorites();
      setFavorites(response.data || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }, [isAuthenticated]);

  // Initial data loading
  useEffect(() => {
    fetchCountries();
    fetchFavorites();
  }, [fetchCountries, fetchFavorites]);

  // Apply filtering when region, language or search term changes
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      try {
        let filtered = [...countries];

        // Apply region filter
        if (selectedRegion) {
          try {
            const regionData = await getCountriesByRegion(selectedRegion);
            filtered = regionData;
          } catch (err) {
            console.error("Error fetching by region:", err);
          }
        }

        // Apply language filter
        if (selectedLanguage) {
          try {
            // If region filter is already applied, filter the current results
            if (selectedRegion) {
              filtered = filtered.filter((country) => {
                if (!country.languages) return false;
                return Object.values(country.languages).some((lang) =>
                  lang.toLowerCase().includes(selectedLanguage.toLowerCase())
                );
              });
            } else {
              // Otherwise, fetch from API
              const languageData = await getCountriesByLanguage(
                selectedLanguage
              );
              filtered = languageData;
            }
          } catch (err) {
            console.error("Error fetching by language:", err);
          }
        }

        // Apply search filter
        if (searchTerm.trim()) {
          try {
            const searchData = await getCountryByName(searchTerm);
            filtered = searchData;
          } catch (err) {
            if (err.response && err.response.status === 404) {
              filtered = [];
            } else {
              console.error("Error searching countries:", err);
            }
          }
        }

        // If showing favorites only, filter by favorites
        if (showFavorites) {
          if (favorites.length > 0) {
            filtered = filtered.filter((country) =>
              favorites.includes(country.cca3)
            );
          } else {
            filtered = []; // If no favorites, show empty list
          }
        }

        setFilteredCountries(filtered);
      } catch (err) {
        setError("Error applying filters");
        console.error("Error applying filters:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch filtered data if we have initial countries
    if (countries.length > 0) {
      if (
        selectedRegion ||
        selectedLanguage ||
        searchTerm.trim() ||
        showFavorites
      ) {
        applyFilters();
      } else {
        setFilteredCountries(countries);
        setLoading(false);
      }
    }
  }, [
    selectedRegion,
    selectedLanguage,
    searchTerm,
    countries,
    showFavorites,
    favorites,
  ]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {showFavorites ? "Your Favorite Countries" : "Explore Countries"}
      </h1>

      {!showFavorites && (
        <SearchFilter
          onSearch={handleSearch}
          onRegionChange={handleRegionChange}
          onLanguageChange={handleLanguageChange}
        />
      )}

      <CountryList
        countries={filteredCountries}
        favorites={favorites}
        loading={loading}
        error={error}
        refreshFavorites={fetchFavorites}
      />

      {showFavorites && favorites.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't added any countries to your favorites yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
