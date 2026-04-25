import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Frendly admin app", () => {
  it("renders the admin console as the root route", () => {
    render(<App />);

    expect(screen.getByText("Admin Console")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Пользователи/i })).toBeInTheDocument();
  });
});
