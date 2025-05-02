import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  formatPopulation,
  getCountryName,
  getCapital,
} from "../utils/formatters";
import { addFavorite, removeFavorite } from "../api/favoritesService";

const CountryCard = ({ country, isFavorite, refreshFavorites }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!country) return null;

  const countryName = getCountryName(country);
  const capital = getCapital(country);
  const { region, population, flags, cca3 } = country;

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFavorite) {
        await removeFavorite(cca3);
      } else {
        await addFavorite(cca3);
      }

      if (refreshFavorites) {
        refreshFavorites();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <Link
      to={`/country/${cca3}`}
      className="block transition-transform hover:scale-105"
    >
      <div className="card h-full overflow-hidden">
        {/* Flag */}
        <div className="aspect-[4/3] overflow-hidden mb-4">
          <img
            src={flags?.png || flags?.svg}
            alt={`Flag of ${countryName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Country Info */}
        <div className="px-1">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold truncate">{countryName}</h2>

            {isAuthenticated && (
              <button
                onClick={handleFavoriteToggle}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorite ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-gray-400" />
                )}
              </button>
            )}
          </div>

          <div className="mt-2">
            <p>
              <span className="font-semibold">Population:</span>{" "}
              {formatPopulation(population)}
            </p>
            <p>
              <span className="font-semibold">Region:</span> {region || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Capital:</span> {capital}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;
