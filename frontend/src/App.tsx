import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import InvoiceManager from "./pages/admin/InvoiceManager";
import HotelManager from "./pages/admin/HotelManager";
import UserManager from "./pages/admin/UserManager";
import Admin from "./pages/admin/Admin";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import MyStore from "./pages/store/MyStore";
import AddStore from "./pages/store/AddStore";
import EditStore from "./pages/store/EditStore";
import Danhmuc from "./pages/danhmuc/Danhmuc";
import ThemDanhmuc from "./pages/danhmuc/ThemDanhmuc";
import Sanpham from "./pages/products/Sanpham";
import Themsp from "./pages/products/Themsanpham";

const App = () => {
  const { isLoggedIn, userRole, userId } = useAppContext();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/detail/:hotelId" element={<Layout><Detail /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/login" element={<Layout><SignIn /></Layout>} />

        {/* Protected Routes - userRole-based Access */}
        {isLoggedIn
         && (
          <>
            {/* userRole 1 - User userRole 1 */}
            {userRole == "1" && (
              <>
                <Route path="/store" element={<Layout><MyStore /></Layout>} />
                <Route path="/add-store" element={<Layout><AddStore /></Layout>} />
                <Route path="/edit-store/:storeId" element={<Layout><EditStore /></Layout>} />
                <Route path="/categories" element={<Layout><Danhmuc /></Layout>} />
                <Route path="/:storeId/add-danhmuc" element={<Layout><ThemDanhmuc /></Layout>} />
                <Route path="/sanpham" element={<Layout><Sanpham /></Layout>} />
                <Route path="/themsanpham" element={<Layout><Themsp /></Layout>} />

                </>
            )}

            {/* userRole 2 - User userRole 2 */}
            {userRole == "2" && (
              <>
                <Route path="/categories" element={<Layout><Danhmuc /></Layout>} />

              </>
            )}

            {/* userRole 3 - Admin userRole 3 */}
            {userRole == "3" && (
              <>
                <Route path="/admin" element={<Layout><Admin /></Layout>} />
                <Route path="/user-manager" element={<Layout><UserManager /></Layout>} />
                <Route path="/hotel-manager" element={<Layout><HotelManager /></Layout>} />
                <Route path="/invoice-manager" element={<Layout><InvoiceManager /></Layout>} />
              </>
            )}
          </>
        )}

        {/* Fallback for all unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
