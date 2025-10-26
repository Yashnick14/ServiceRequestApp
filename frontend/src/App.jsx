import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import TripRequestForm from "./pages/customer/TripRequestForm";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/customer" element={<TripRequestForm />} />
      </Routes>
    </Router>
  );
}

export default App;
