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
import Upload from "./Upload";
import Browse from "./Browse";
import Error from "./Error";
import Redeem from "./Redeem";
import RedeemCode from "./RedeemCode";
import { useAuthorization } from "../hooks/useAuthorization";
import Manage from "./Manage";
import Share from "./Share";
import Profile from "./Profile";

function App() {
  const { uid } = useAuthorization();

  return (
    <HashRouter>
      <ThemeProvider theme={yellowTheme}>
        <AppContainer>
          <Header />
          <BodyContainer>
            <Routes>
              <Route path="/" element={<Home uid={uid} />} />
              <Route path="/upload" element={<Upload uid={uid} />} />
              <Route path="/browse" element={<Browse uid={uid} />} />
              <Route path="/redeem" element={<Redeem />} />
              <Route path="/redeem/:code" element={<RedeemCode />} />
              <Route path="/manage" element={<Manage uid={uid} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/share" element={<Share />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </BodyContainer>
          <Footer />
        </AppContainer>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
