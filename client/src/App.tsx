import React from 'react';
import Dashboard from "./components/dashboard";
import { useLocale } from "./hooks/use-locale";
import Container from 'react-bootstrap/Container';
import DashboardHeader from "./components/dashboard-header";
import { useLayout } from "./hooks/use-layout";

const App: React.FC = () => {

    const [currentLayout, setLayout] = useLayout()
    let appContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    const locale = useLocale();

    return (
        <div className={"vertical-scroll"} ref={appContainerRef}>
            <DashboardHeader
                appContainerRef={appContainerRef}
                currentLayout={currentLayout}
                locale={locale}
                handleOnClick={setLayout}
            />
            <Container fluid={true}>
                <Dashboard layout={currentLayout} locale={locale}/>
            </Container>
        </div>
    );
};

export default App;
