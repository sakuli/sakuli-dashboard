import React from 'react';
import DashboardComponent from "./components/dashboard.component";
import { useLocale } from "./hooks/use-locale";
import Container from 'react-bootstrap/Container';
import DashboardHeaderComponent from "./components/dashboard-header.component";
import { useLayout } from "./hooks/use-layout";

const App: React.FC = () => {

    const [currentLayout, setLayout] = useLayout()
    let appContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    const locale = useLocale();

    return (
        <div className={"vertical-scroll"} ref={appContainerRef}>
            <DashboardHeaderComponent
                appContainerRef={appContainerRef}
                currentLayout={currentLayout}
                locale={locale}
                handleOnClick={setLayout}
            />
            <Container fluid={true}>
                <DashboardComponent layout={currentLayout} locale={locale}/>
            </Container>
        </div>
    );
};

export default App;
