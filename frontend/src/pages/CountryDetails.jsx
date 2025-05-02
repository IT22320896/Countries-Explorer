import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { getCountryByCode } from "../api/countriesService";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../api/favoritesService";
import { AuthContext } from "../context/AuthContext";
import {
  formatPopulation,
  extractLanguages,
  formatArrayToString,
  getCountryName,
  getCapital,
  getRegionInfo,
} from "../utils/formatters";

const CountryDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [country, setCountry] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullFlag, setShowFullFlag] = useState(false);

  // Fetch country details
  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch (err) {
        setError("Failed to fetch country details");
        console.error("Error fetching country details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  // Check if country is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await getFavorites();
        const favorites = response.data || [];
        setIsFavorite(favorites.includes(code));
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavoriteStatus();
  }, [code, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", {
        state: {
          from: `/country/${code}`,
          message: "Log in to save countries to your favorites",
        },
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(code);
      } else {
        await addFavorite(code);
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg">Loading country information...</span>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-500 text-xl mb-2">
            {error || "Country not found. Please try again."}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The country code "{code}" could not be found in our database.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 btn btn-primary flex items-center mx-auto px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const countryName = getCountryName(country);
  const capital = getCapital(country);
  const region = getRegionInfo(country);
  const languages = extractLanguages(country.languages);
  const currencies = country.currencies
    ? Object.values(country.currencies).map((c) => c.name)
    : [];

  // Calculate area in a readable format
  const formatArea = (area) => {
    if (!area) return "N/A";
    return area > 1000
      ? `${(area / 1000).toFixed(1)} thousand km²`
      : `${area} km²`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="btn btn-secondary flex items-center px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Country Code: <span className="font-mono font-semibold">{code}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Flag Section */}
        <div className="flex flex-col items-center">
          <div
            className={`relative overflow-hidden rounded-md shadow-lg ${
              showFullFlag ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setShowFullFlag(!showFullFlag)}
          >
            <div
              className={`${
                showFullFlag ? "scale-100" : "scale-95"
              } transition-transform duration-300`}
            >
              <img
                src={country.flags?.svg || country.flags?.png}
                alt={`Flag of ${countryName}`}
                className="w-full object-cover rounded-md"
                loading="eager"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-md">
              {showFullFlag ? "Click to zoom out" : "Click to zoom in"}
            </div>
          </div>

          {country.coatOfArms?.svg && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Coat of Arms</h3>
              <img
                src={country.coatOfArms.svg}
                alt={`Coat of Arms of ${countryName}`}
                className="max-h-32 mx-auto"
              />
            </div>
          )}
        </div>

        {/* Country Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{countryName}</h1>

            <button
              onClick={handleFavoriteToggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <HeartSolid className="h-7 w-7 text-red-500" />
              ) : (
                <HeartOutline className="h-7 w-7 text-gray-500 hover:text-red-500" />
              )}
            </button>
          </div>

          {country.name?.nativeName && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
              {Object.values(country.name.nativeName)[0].common}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <InfoItem
                icon={<MapPinIcon className="h-5 w-5 text-blue-500" />}
                label="Capital"
                value={capital}
              />

              <InfoItem
                icon={<GlobeAltIcon className="h-5 w-5 text-green-500" />}
                label="Region"
                value={region}
              />

              <InfoItem
                icon={<UserGroupIcon className="h-5 w-5 text-purple-500" />}
                label="Population"
                value={formatPopulation(country.population)}
              />

              <InfoItem label="Area" value={formatArea(country.area)} />
            </div>

            <div>
              <InfoItem
                icon={<LanguageIcon className="h-5 w-5 text-amber-500" />}
                label="Languages"
                value={formatArrayToString(languages)}
              />

              <InfoItem
                label="Currencies"
                value={formatArrayToString(currencies)}
              />

              <InfoItem
                label="Top Level Domain"
                value={formatArrayToString(country.tld)}
              />

              {country.car?.side && (
                <InfoItem
                  label="Driving Side"
                  value={country.car.side === "right" ? "Right" : "Left"}
                />
              )}
            </div>
          </div>

          {/* Map Link */}
          {country.maps?.googleMaps && (
            <div className="mt-6 border-t pt-4 dark:border-gray-700">
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                <MapPinIcon className="h-5 w-5 mr-2" />
                View on Google Maps
              </a>
            </div>
          )}

          {/* Border Countries */}
          {country.borders && country.borders.length > 0 && (
            <div className="mt-8 border-t pt-4 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">Border Countries:</h3>
              <div className="flex flex-wrap items-center gap-2">
                {country.borders.map((border) => (
                  <button
                    key={border}
                    onClick={() => navigate(`/country/${border}`)}
                    className="px-4 py-2 bg-white dark:bg-gray-700 shadow-md rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  >
                    {border}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extra Country Details */}
      {(country.timezones || country.continents || country.subregion) && (
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {country.continents && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Continents
                </h3>
                <ul className="list-disc list-inside">
                  {country.continents.map((continent) => (
                    <li
                      key={continent}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {continent}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {country.subregion && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subregion
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {country.subregion}
                </p>
              </div>
            )}

            {country.timezones && country.timezones.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezones
                </h3>
                <div className="max-h-40 overflow-y-auto pr-2">
                  <ul className="list-disc list-inside">
                    {country.timezones.map((timezone) => (
                      <li
                        key={timezone}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        {timezone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable component for displaying info items
const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="mb-3">
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {label}:
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 ml-7">{value || "N/A"}</p>
    </div>
  );
};

export default CountryDetails;
