// jest-dom adds custom jest matchers for asserting on DOM nodes.
// This allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock heroicons
vi.mock("@heroicons/react/24/outline", () => ({
  MagnifyingGlassIcon: () =>
    React.createElement("svg", { "data-testid": "search-icon" }),
  ArrowLeftIcon: () =>
    React.createElement("svg", { "data-testid": "arrow-left-icon" }),
  HeartIcon: () =>
    React.createElement("svg", { "data-testid": "heart-outline-icon" }),
  MoonIcon: () => React.createElement("svg", { "data-testid": "moon-icon" }),
  SunIcon: () => React.createElement("svg", { "data-testid": "sun-icon" }),
  Bars3Icon: () => React.createElement("svg", { "data-testid": "menu-icon" }),
  XMarkIcon: () => React.createElement("svg", { "data-testid": "x-icon" }),
}));

vi.mock("@heroicons/react/24/solid", () => ({
  HeartIcon: () =>
    React.createElement("svg", { "data-testid": "heart-solid-icon" }),
  MoonIcon: () =>
    React.createElement("svg", { "data-testid": "moon-solid-icon" }),
}));

// Mock ResizeObserver which is not available in test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
