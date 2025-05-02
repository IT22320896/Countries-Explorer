import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchFilter from "../components/SearchFilter";

describe("SearchFilter", () => {
  const mockOnSearch = vi.fn();
  const mockOnRegionChange = vi.fn();
  const mockOnLanguageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with all filters", () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onRegionChange={mockOnRegionChange}
        onLanguageChange={mockOnLanguageChange}
      />
    );

    // Check search box
    expect(
      screen.getByPlaceholderText("Search for a country...")
    ).toBeInTheDocument();

    // Check region dropdown
    const regionFilter = screen.getByLabelText("Filter by region");
    expect(regionFilter).toBeInTheDocument();
    expect(screen.getByText("All Regions")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();

    // Check language dropdown
    const languageFilter = screen.getByLabelText("Filter by language");
    expect(languageFilter).toBeInTheDocument();
    expect(screen.getByText("All Languages")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
  });

  it("calls onSearch when typing in search box", () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onRegionChange={mockOnRegionChange}
        onLanguageChange={mockOnLanguageChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search for a country..."), {
      target: { value: "canada" },
    });

    expect(mockOnSearch).toHaveBeenCalledWith("canada");
  });

  it("calls onRegionChange when selecting a region", () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onRegionChange={mockOnRegionChange}
        onLanguageChange={mockOnLanguageChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Filter by region"), {
      target: { value: "Europe" },
    });

    expect(mockOnRegionChange).toHaveBeenCalledWith("Europe");
  });

  it("calls onLanguageChange when selecting a language", () => {
    render(
      <SearchFilter
        onSearch={mockOnSearch}
        onRegionChange={mockOnRegionChange}
        onLanguageChange={mockOnLanguageChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Filter by language"), {
      target: { value: "Spanish" },
    });

    expect(mockOnLanguageChange).toHaveBeenCalledWith("Spanish");
  });
});
