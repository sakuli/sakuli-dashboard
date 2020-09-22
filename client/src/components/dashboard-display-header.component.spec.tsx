import React from 'react';
import DashboardDisplayHeaderComponent from "./dashboard-display-header.component";
import { Display, Messages } from "@sakuli-dashboard/api";
import { render } from '@testing-library/react';

describe("dashboard display component", () => {
  let messages: Record<string, Messages>;
  let display: Display;
  let displayContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
  let onClick = () => {};
  let isLoading: boolean;
  let pageIsAvailable: boolean;

  test('loads and display', async () => {
    // GIVEN
      messages = {
        "en": {
          description: "description",
          infoText: "infoText"
        }
      }
      display = {
        actionIdentifier: "identifier",
        height: "100",
        index: 0,
        messages: messages,
        url: "https://sakuli.io",
        width: "100"
      }
      pageIsAvailable = false;
      isLoading = false;

    // WHEN
    let { getByTestId } = render(
      <DashboardDisplayHeaderComponent
        locale={"en"}
        display={display}
        displayContainerRef={displayContainerRef}
        onClick={onClick}
        isLoading={isLoading}
        pageIsAvailable={pageIsAvailable}
      />);

    // THEN
    expect(getByTestId(`display-header-description-${display.index}`)).toHaveTextContent(messages["en"].description);
    expect(getByTestId(`display-header-fullscreen-${display.index}`)).toBeInTheDocument();
  });
});























































//     it("should render action button when actionIdentifier is given", () => {
//       // GIVEN
//       const display: Display = {
//         index: 0,
//         actionIdentifier: "just-an-identifier",
//         messages: messages,
//         url: "",
//         width: "",
//         height: "",
//       }
//       const dashboardDisplayHeaderProp: DashboardDisplayHeaderProps = {
//         display: display,
//         displayContainerRef: displayRef,
//         isLoading: false,
//         locale: "",
//         onClick(): void {},
//         pageIsAvailable: false
//       }
//
//       // WHEN
//       act(() => {
//         render(
//           <DashboardDisplayHeaderComponent
//             locale={dashboardDisplayHeaderProp.locale}
//             display={dashboardDisplayHeaderProp.display}
//             displayContainerRef={dashboardDisplayHeaderProp.displayContainerRef}
//             onClick={dashboardDisplayHeaderProp.onClick}
//             isLoading={dashboardDisplayHeaderProp.isLoading}
//             pageIsAvailable={dashboardDisplayHeaderProp.pageIsAvailable}
//           />,
//           container
//         );
//       });
//
//       // THEN
//       expect(container.querySelector(".action-button")).toBeDefined();
//     });
//   })
// });