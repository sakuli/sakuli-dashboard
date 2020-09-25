import React from 'react';
import DashboardDisplayHeaderComponent from "./dashboard-display-header.component";
import { Display, Messages } from "@sakuli-dashboard/api";
import { render } from '@testing-library/react';

jest.mock("./action-button.component", () => {
  return () => {
    return (
      <button data-testid={"action-button"}>Action Button</button>
    )
  }
});
jest.mock("./fullscreen-button.component", () => {
  return () => {
    return (
      <button data-testid={"fullscreen-button"}>Fullscreen Button</button>
    )
  }
});

describe("dashboard display component", () => {
  const displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
  const onClick = () => {};
  const isLoading = false;
  const pageIsAvailable = false;

  test('loads and displays every used component', async () => {
    // GIVEN
    const messages: Record<string, Messages> = {
      "en": {
        infoText: "info",
        description: "description"
      }
    };
    const display: Display = {
      actionIdentifier: "identifier",
      height: "100",
      index: 0,
      messages: messages,
      url: "https://sakuli.io",
      width: "100"
    };

    // WHEN
    const { getByTestId } = render(
      <DashboardDisplayHeaderComponent
        locale={"en"}
        display={display}
        displayContainerRef={displayContainerRef}
        onClick={onClick}
        isLoading={isLoading}
        pageIsAvailable={pageIsAvailable}
      />);

    // THEN
    expect(getByTestId(`info-icon-${display.index}`)).toBeInTheDocument();
    expect(getByTestId(`display-header-description-${display.index}`)).toHaveTextContent(messages["en"].description);
    expect(getByTestId('action-button')).toBeInTheDocument();
    expect(getByTestId('fullscreen-button')).toBeInTheDocument();
  });

  test("should not display action button when action identifier is empty", () => {
    // GIVEN
    const messages: Record<string, Messages> = {
      "en": {
        infoText: "info",
        description: "description"
      }
    };
    const display: Display = {
      actionIdentifier: "",
      height: "100",
      index: 0,
      messages: messages,
      url: "https://sakuli.io",
      width: "100"
    };

    // WHEN
    const { queryByTestId } = render(
      <DashboardDisplayHeaderComponent
        locale={"en"}
        display={display}
        displayContainerRef={displayContainerRef}
        onClick={onClick}
        isLoading={isLoading}
        pageIsAvailable={pageIsAvailable}
      />);

    //THEN
    expect(queryByTestId('action-button')).not.toBeInTheDocument();
  });
});
