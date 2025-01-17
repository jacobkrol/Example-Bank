// modules
import { ThemeProvider } from "styled-components";
import { Routes, Route, HashRouter } from "react-router-dom";

// styles
import yellowTheme from "../styles/yellowTheme.json";
import { AppContainer, BodyContainer } from "../styles/styled";
import "../styles/wiredstyles.css";

// components
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import { useAuthorization } from "../hooks/useAuthorization";

function App() {
  const { uid } = useAuthorization();

  return (
    <HashRouter>
      <ThemeProvider theme={yellowTheme}>
        <AppContainer>
          <Header />
          <BodyContainer>
            <Routes>
              <Route path="*" element={<Home uid={uid} />} />
            </Routes>
          </BodyContainer>
          <Footer />
        </AppContainer>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
