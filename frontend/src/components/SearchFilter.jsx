import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchFilter = ({ onSearch, onRegionChange, onLanguageChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [commonLanguages, setCommonLanguages] = useState([]);
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  // Most common languages worldwide - could be fetched dynamically
  useEffect(() => {
    setCommonLanguages([
      "English",
      "Spanish",
      "French",
      "Arabic",
      "Portuguese",
      "Russian",
      "Hindi",
      "Mandarin",
      "Japanese",
      "German",
      "Korean",
      "Italian",
    ]);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleRegionChange = (e) => {
    onRegionChange(e.target.value);
  };

  const handleLanguageChange = (e) => {
    onLanguageChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Form - remains in the same position */}
        <form onSubmit={handleSubmit} className="relative w-full md:w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input pl-10"
              aria-label="Search for a country"
            />
          </div>
        </form>

        {/* Filter Container - Positioned at the right, containing both filters side by side */}
        <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
          {/* Language Filter */}
          <div className="w-full md:w-48">
            <select
              onChange={handleLanguageChange}
              className="input w-full"
              aria-label="Filter by language"
              defaultValue=""
            >
              <option value="" disabled>
                Filter by Language
              </option>
              <option value="">All Languages</option>
              {commonLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter - now positioned right next to the language filter */}
          <div className="w-full md:w-48">
            <select
              onChange={handleRegionChange}
              className="input w-full"
              aria-label="Filter by region"
              defaultValue=""
            >
              <option value="" disabled>
                Filter by Region
              </option>
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
