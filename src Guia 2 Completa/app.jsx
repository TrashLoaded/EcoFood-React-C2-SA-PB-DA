import { Routes, Route } from "react-router-dom";
import Login from "src/pages/Login";
import Home from "<source />/pages/Home";
import ProtectedRoute from "src/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;