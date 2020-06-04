import React, {useState} from 'react';
import DashboardComponent from "./components/dashboard.component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThLarge, faThList} from "@fortawesome/free-solid-svg-icons";
import {useLocale} from "./hooks/use-locale";
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import FullscreenButtonComponent from "./components/fullscreen-button.component";


export type LayoutMode = "row" | "column";

const App: React.FC = () => {

    const [currentLayout, setLayout] = useState<LayoutMode>("column");

    let appContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    const locale = useLocale();

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
        <NavDropdown id={"language-dropdown"} title={getLanguageIcon(locale)} className={"dropdown-menu-right"}>
            <NavDropdown.Item href="?lang=de">{getLanguageIcon("de")} Deutsch</NavDropdown.Item>
            <NavDropdown.Item href="?lang=en">{getLanguageIcon("en")} English</NavDropdown.Item>
        </NavDropdown>
    );

    const layoutButtonGroup = (
        <ButtonGroup aria-label={"Layout Buttons"} size={"sm"}>
            <Button variant={"light"} disabled={currentLayout === "column"} onClick={() => setLayout("column")}>
                <FontAwesomeIcon icon={faThList}/>
            </Button>
            <Button variant={"light"} disabled={currentLayout === "row"} onClick={() => setLayout("row")}>
                <FontAwesomeIcon icon={faThLarge}/>
            </Button>
        </ButtonGroup>
    );

    return (
        <div className={"vertical-scroll"} ref={appContainerRef}>
            <Navbar bg="light" variant="light" className={"border-bottom border-success"}>
                <Navbar.Text className={"text-center"}>Sakuli Dashboard</Navbar.Text>
                <Navbar.Collapse className={"justify-content-end"}>
                    {languageDropdownMenu}
                    {layoutButtonGroup}
                    <FullscreenButtonComponent target={appContainerRef}/>
                </Navbar.Collapse>
            </Navbar>
            <Container fluid={true}>
                <DashboardComponent layout={currentLayout} locale={locale}/>
            </Container>
        </div>
    );
};

export default App;
