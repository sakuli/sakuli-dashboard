import Navbar from "react-bootstrap/Navbar";
import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faThList } from "@fortawesome/free-solid-svg-icons";
import FullscreenButtonComponent from "./fullscreen-button.component";
import { LayoutMode } from "@sakuli-dashboard/api";

interface DashboardHeaderProps {
    locale: string
    currentLayout: LayoutMode
    handleOnClick: (layout: LayoutMode) => void
    appContainerRef: React.RefObject<HTMLDivElement>
}

const DashboardHeaderComponent: React.FC<DashboardHeaderProps> = (props: DashboardHeaderProps) => {
    const getLanguageIcon = (lang: string) => {
        switch (lang) {
            case "de":
                return String.fromCodePoint(0x1F1E9, 0x1F1EA);
            case "en":
                return String.fromCodePoint(0x1F1EC, 0x1F1E7);
            default:
                return String.fromCodePoint(0x1F3F3, 0xFE0F);
        }
    };

    const languageDropdownMenu = (
        <NavDropdown id={"language-dropdown"} title={getLanguageIcon(props.locale)} alignRight>
            <NavDropdown.Item href="?lang=de">{getLanguageIcon("de")} Deutsch</NavDropdown.Item>
            <NavDropdown.Item href="?lang=en">{getLanguageIcon("en")} English</NavDropdown.Item>
        </NavDropdown>
    );

    const buttonGroup = (
        <div className={"row d-none d-md-block d-xl-block"}>
            <ButtonGroup aria-label={"Layout Buttons"} size={"sm"}>
                <Button
                    variant={"light"}
                    disabled={props.currentLayout === "column"}
                    onClick={() => props.handleOnClick("column")}
                >
                    <FontAwesomeIcon icon={faThList}/>
                </Button>
                <Button
                    variant={"light"}
                    disabled={props.currentLayout === "row"}
                    onClick={() => props.handleOnClick("row")}
                >
                    <FontAwesomeIcon icon={faThLarge}/>
                </Button>
            </ButtonGroup>
            <FullscreenButtonComponent target={props.appContainerRef}/>
        </div>

    );

    return (
        <Navbar bg="light" variant="light" className={"border-bottom border-success"}>
            <Navbar.Text className={"text-center"}>Sakuli Dashboard</Navbar.Text>
            <Navbar.Collapse className={"justify-content-end"}>
                {languageDropdownMenu}
                {buttonGroup}
            </Navbar.Collapse>
        </Navbar>
    );
}
export default DashboardHeaderComponent;