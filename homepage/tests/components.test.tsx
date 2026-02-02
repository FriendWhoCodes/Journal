import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "../app/components/Hero";
import Footer from "../app/components/Footer";

describe("Hero Component", () => {
  it("should render the main heading", () => {
    render(<Hero />);
    expect(screen.getByText(/Ancient Wisdom/i)).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Hero />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("should render call-to-action buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Explore Products")).toBeInTheDocument();
    expect(screen.getByText("Free Goal Setter")).toBeInTheDocument();
  });

  it("should have correct links", () => {
    render(<Hero />);
    const goalSetterLink = screen.getByText("Free Goal Setter").closest("a");
    expect(goalSetterLink).toHaveAttribute("href", "https://goals.manofwisdom.co");
  });
});

describe("Footer Component", () => {
  it("should render the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Man of Wisdom")).toBeInTheDocument();
  });

  it("should render product links", () => {
    render(<Footer />);
    expect(screen.getByText("Goal Setter")).toBeInTheDocument();
    expect(screen.getByText("Journal")).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<Footer />);
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("should render music platform links", () => {
    render(<Footer />);
    expect(screen.getByText("Spotify")).toBeInTheDocument();
    expect(screen.getByText("Apple Music")).toBeInTheDocument();
    expect(screen.getByText("Amazon Music")).toBeInTheDocument();
    expect(screen.getByText("YouTube")).toBeInTheDocument();
  });

  it("should have correct Spotify link", () => {
    render(<Footer />);
    const spotifyLink = screen.getByText("Spotify").closest("a");
    expect(spotifyLink).toHaveAttribute(
      "href",
      "https://open.spotify.com/artist/59S9iaGBrrWXl242r9hLpm"
    );
  });
});
