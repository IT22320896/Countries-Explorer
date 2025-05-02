import { useState, useEffect } from "react";
import CountryCard from "./CountryCard";

const CountryList = ({
  countries,
  favorites,
  loading,
  error,
  refreshFavorites,
}) => {
  const [favoriteSet, setFavoriteSet] = useState(new Set());

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      setFavoriteSet(new Set(favorites));
    } else {
      setFavoriteSet(new Set());
    }
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!countries || countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No countries found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          isFavorite={favoriteSet.has(country.cca3)}
          refreshFavorites={refreshFavorites}
        />
      ))}
    </div>
  );
};

export default CountryList;
