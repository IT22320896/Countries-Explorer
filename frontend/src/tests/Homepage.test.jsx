import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Homepage from "../pages/Homepage";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the API calls
vi.mock("../api/countriesService", () => ({
  getAllCountries: vi.fn().mockResolvedValue([
    {
      name: { common: "France", official: "French Republic" },
      cca3: "FRA",
      capital: ["Paris"],
      region: "Europe",
      population: 67391582,
      flags: { png: "france.png", svg: "france.svg" },
      languages: { fra: "French" },
    },
    {
      name: { common: "Spain", official: "Kingdom of Spain" },
      cca3: "ESP",
      capital: ["Madrid"],
      region: "Europe",
      population: 47351567,
      flags: { png: "spain.png", svg: "spain.svg" },
      languages: { spa: "Spanish" },
    },
  ]),
  getCountriesByRegion: vi.fn().mockImplementation((region) => {
    if (region === "Europe") {
      return Promise.resolve([
        {
          name: { common: "France", official: "French Republic" },
          cca3: "FRA",
          capital: ["Paris"],
          region: "Europe",
          population: 67391582,
          flags: { png: "france.png", svg: "france.svg" },
          languages: { fra: "French" },
        },
        {
          name: { common: "Spain", official: "Kingdom of Spain" },
          cca3: "ESP",
          capital: ["Madrid"],
          region: "Europe",
          population: 47351567,
          flags: { png: "spain.png", svg: "spain.svg" },
          languages: { spa: "Spanish" },
        },
      ]);
    }
    return Promise.resolve([]);
  }),
  getCountryByName: vi.fn().mockImplementation((name) => {
    if (name.toLowerCase() === "france") {
      return Promise.resolve([
        {
          name: { common: "France", official: "French Republic" },
          cca3: "FRA",
          capital: ["Paris"],
          region: "Europe",
          population: 67391582,
          flags: { png: "france.png", svg: "france.svg" },
          languages: { fra: "French" },
        },
      ]);
    }
    return Promise.resolve([]);
  }),
  getCountriesByLanguage: vi.fn().mockImplementation((language) => {
    if (language.toLowerCase() === "spanish") {
      return Promise.resolve([
        {
          name: { common: "Spain", official: "Kingdom of Spain" },
          cca3: "ESP",
          capital: ["Madrid"],
          region: "Europe",
          population: 47351567,
          flags: { png: "spain.png", svg: "spain.svg" },
          languages: { spa: "Spanish" },
        },
        {
          name: { common: "Mexico", official: "United Mexican States" },
          cca3: "MEX",
          capital: ["Mexico City"],
          region: "Americas",
          population: 128932753,
          flags: { png: "mexico.png", svg: "mexico.svg" },
          languages: { spa: "Spanish" },
        },
      ]);
    } else if (language.toLowerCase() === "french") {
      return Promise.resolve([
        {
          name: { common: "France", official: "French Republic" },
          cca3: "FRA",
          capital: ["Paris"],
          region: "Europe",
          population: 67391582,
          flags: { png: "france.png", svg: "france.svg" },
          languages: { fra: "French" },
        },
      ]);
    }
    return Promise.resolve([]);
  }),
}));

vi.mock("../api/favoritesService", () => ({
  getFavorites: vi.fn().mockResolvedValue({ data: [] }),
}));

// Mock CountryList component
vi.mock("../components/CountryList", () => ({
  default: ({ countries }) => (
    <div data-testid="country-list">
      {countries.map((country) => (
        <div key={country.cca3} data-testid={`country-${country.cca3}`}>
          {country.name.common}
        </div>
      ))}
    </div>
  ),
}));

// Mock SearchFilter component
vi.mock("../components/SearchFilter", () => ({
  default: ({ onSearch, onRegionChange, onLanguageChange }) => (
    <div data-testid="search-filter">
      <input
        data-testid="search-input"
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        data-testid="region-select"
        onChange={(e) => onRegionChange(e.target.value)}
      >
        <option value="">All Regions</option>
        <option value="Europe">Europe</option>
      </select>
      <select
        data-testid="language-select"
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        <option value="">All Languages</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
      </select>
    </div>
  ),
}));

const renderWithAuth = (ui, { isAuthenticated = false } = {}) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("Homepage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays all countries initially", async () => {
    renderWithAuth(<Homepage />);

    await waitFor(() => {
      expect(screen.getByTestId("country-FRA")).toBeInTheDocument();
      expect(screen.getByTestId("country-ESP")).toBeInTheDocument();
    });
  });

  it("filters countries by language", async () => {
    renderWithAuth(<Homepage />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByTestId("country-list")).toBeInTheDocument();
    });

    // Change language filter to Spanish
    const languageSelect = screen.getByTestId("language-select");
    fireEvent.change(languageSelect, { target: { value: "Spanish" } });

    // Wait for Spanish countries to load
    await waitFor(() => {
      expect(screen.getByTestId("country-ESP")).toBeInTheDocument();
      expect(screen.getByTestId("country-MEX")).toBeInTheDocument();
      expect(screen.queryByTestId("country-FRA")).not.toBeInTheDocument();
    });

    // Change language filter to French
    fireEvent.change(languageSelect, { target: { value: "French" } });

    // Wait for French countries to load
    await waitFor(() => {
      expect(screen.getByTestId("country-FRA")).toBeInTheDocument();
      expect(screen.queryByTestId("country-ESP")).not.toBeInTheDocument();
      expect(screen.queryByTestId("country-MEX")).not.toBeInTheDocument();
    });
  });
});
