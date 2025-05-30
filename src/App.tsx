import Layout from "./components/Layaut";
import { Login } from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Home from "./pages/Home";
import {Register} from "./pages/Register";
import DesprotectedRoute from "./components/utils/DesprotectedRoute";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={<DesprotectedRoute element={<Login />} />}
            />
            <Route
              path="/register"
              element={<DesprotectedRoute element={<Register />} />}
            />
            <Route
              path="/inicio"
              element={<ProtectedRoute element={<Home />} />}
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
