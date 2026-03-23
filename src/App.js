import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import VendorHome from "./pages/VendorHome";
import VendorOrders from "./pages/VendorOrders";
import VendorMenu from "./pages/VendorMenu";
import VendorHistory from "./pages/VendorHistory";
import ItemsPage from "./pages/ItemsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import StudentOrders from "./pages/StudentOrders";
import StudentHistory from "./pages/StudentHistory";
import StudentProfile from "./pages/StudentProfile";

import AdminHome from "./pages/AdminHome";
import AdminUsers from "./pages/AdminUsers";
import AdminCreateUser from "./pages/AdminCreateUser";
import AdminAnalytics from "./pages/AdminAnalytics";

import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "student") return <Navigate to="/student" replace />;
    if (role === "vendor") return <Navigate to="/vendor" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>

        <Toaster position="top-center" reverseOrder={false} />

        <Routes>

          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/student" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student/orders" element={
            <ProtectedRoute role="student">
              <StudentOrders />
            </ProtectedRoute>
          } />

          <Route path="/student/history" element={
            <ProtectedRoute role="student">
              <StudentHistory />
            </ProtectedRoute>
          } />

          <Route path="/student/profile" element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          } />

          <Route path="/student/cart" element={
            <ProtectedRoute role="student">
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="/student/vendor/:vendorId" element={
            <ProtectedRoute role="student">
              <ItemsPage />
            </ProtectedRoute>
          } />

          <Route path="/student/item/:itemId/:vendorId" element={
            <ProtectedRoute role="student">
              <ItemDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/vendor" element={
            <ProtectedRoute role="vendor">
              <VendorHome />
            </ProtectedRoute>
          } />

          <Route path="/vendor/orders" element={
            <ProtectedRoute role="vendor">
              <VendorOrders />
            </ProtectedRoute>
          } />

          <Route path="/vendor/menu" element={
            <ProtectedRoute role="vendor">
              <VendorMenu />
            </ProtectedRoute>
          } />

          <Route path="/vendor/history" element={
            <ProtectedRoute role="vendor">
              <VendorHistory />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminHome />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />

          <Route path="/admin/create-user" element={
            <ProtectedRoute role="admin">
              <AdminCreateUser />
            </ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute role="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          } />

        </Routes>

      </CartProvider>
    </BrowserRouter>
  );
}

export default App;