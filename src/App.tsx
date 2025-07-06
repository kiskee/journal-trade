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
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
