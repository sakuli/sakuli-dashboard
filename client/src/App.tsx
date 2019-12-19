import React, { useEffect, useState } from 'react';
import './App.css';
import Iframe from 'react-iframe';
import { DisplaysResponse } from "../../server/src/displays-response.interface";

const App: React.FC = () => {
  const [displays, setDisplays] = useState<DisplaysResponse>([]);

  useEffect(() => {
    fetch('/api/displays')
      .then(r => r.json())
      .then(d => setDisplays(d))
  }, []);

  return (
    <div className="App">
      {displays.map(display => (
        <Iframe
          url={display.url}
          width="49%" height="1000"
          display={"inline"}
        />
      ))}
    </div>
  );
};

export default App;
