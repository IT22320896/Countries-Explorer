import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CountryCard from "../components/CountryCard";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock formatters
vi.mock("../utils/formatters", () => ({
  formatPopulation: () => "1,000,000",
  getCountryName: (country) => country.name.common,
  getCapital: (country) => country.capital?.[0] || "N/A",
}));

// Mock API calls
vi.mock("../api/favoritesService", () => ({
  addFavorite: vi.fn().mockResolvedValue({}),
  removeFavorite: vi.fn().mockResolvedValue({}),
}));

const mockCountry = {
  name: {
    common: "Test Country",
    official: "Official Test Country",
  },
  population: 1000000,
  region: "Test Region",
  capital: ["Test Capital"],
  flags: {
    png: "test-flag.png",
    svg: "test-flag.svg",
  },
  cca3: "TST",
};

const renderWithRouter = (ui, { isAuthenticated = false } = {}) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("CountryCard", () => {
  it("renders country information correctly", () => {
    renderWithRouter(<CountryCard country={mockCountry} isFavorite={false} />);

    expect(screen.getByText("Test Country")).toBeInTheDocument();
    expect(screen.getByText("Population:")).toBeInTheDocument();
    expect(screen.getByText("1,000,000")).toBeInTheDocument();
    expect(screen.getByText("Region:")).toBeInTheDocument();
    expect(screen.getByText("Test Region")).toBeInTheDocument();
    expect(screen.getByText("Capital:")).toBeInTheDocument();
    expect(screen.getByText("Test Capital")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-flag.png");
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      "Flag of Test Country"
    );
  });

  it("does not show favorite button when user is not authenticated", () => {
    renderWithRouter(<CountryCard country={mockCountry} isFavorite={false} />);

    const favoriteButton = screen.queryByLabelText("Add to favorites");
    expect(favoriteButton).not.toBeInTheDocument();
  });

  it("shows favorite button when user is authenticated", () => {
    renderWithRouter(<CountryCard country={mockCountry} isFavorite={false} />, {
      isAuthenticated: true,
    });

    const favoriteButton = screen.getByLabelText("Add to favorites");
    expect(favoriteButton).toBeInTheDocument();
  });

  it("shows filled heart when country is a favorite", () => {
    renderWithRouter(<CountryCard country={mockCountry} isFavorite={true} />, {
      isAuthenticated: true,
    });

    const favoriteButton = screen.getByLabelText("Remove from favorites");
    expect(favoriteButton).toBeInTheDocument();
  });
});
