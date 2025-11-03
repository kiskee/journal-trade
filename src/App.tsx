import Layout from "./components/Layaut";
import { Login } from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Home from "./pages/Home";
import { Register } from "./pages/Register";
import DesprotectedRoute from "./components/utils/DesprotectedRoute";
import IntLayaout from "./components/IntLayaout";
import CreateTrade from "./pages/CreateTrade";
import Analytics from "./pages/Analytics";
import Portfolio from "./pages/Portfolio";
import Notes from "./pages/Notes";
import ResetPass from "./pages/ResetPass";
import CreateAccount from "./pages/CreateAccount";
import Acccounts from "./pages/Accounts";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={<DesprotectedRoute element={<Login />} />}
            />
            <Route
              path="/register"
              element={<DesprotectedRoute element={<Register />} />}
            />
            <Route
              path="/reset-password"
              element={<DesprotectedRoute element={<ResetPass />} />}
            />

            {/* Rutas protegidas con IntLayout */}
            <Route
              path="/inicio"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Home />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/trade"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <CreateTrade />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Analytics />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Portfolio />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Notes />
                    </IntLayaout>
                  }
                />
              }
            />
            <Route
              path="/create-account"
              element={<ProtectedRoute element={<CreateAccount />} />}
            />
            <Route
              path="/strategies"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Notes />
                    </IntLayaout>
                  }
                />
              }
            />
             <Route
              path="/accounts"
              element={
                <ProtectedRoute
                  element={
                    <IntLayaout>
                      <Acccounts />
                    </IntLayaout>
                  }
                />
              }
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
