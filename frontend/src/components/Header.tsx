import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn, userRole, userId } = useAppContext();

  return (
    <nav className="bg-gray-800 shadow-md relative z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link to="/">ShopLogo</Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <li>
            <Link to="/" className="hover:text-green-400">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/sanpham" className="hover:text-green-400">
              Sản Phẩm
            </Link>
          </li>

          {/* Conditional Rendering for different user roles */}
          {isLoggedIn && userRole == "1" ? (
            <>
              {/* For Admin (userRole = 1) */}
              <li>
                <Link to="/categories" className="hover:text-green-400">
                  Danh Mục
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-green-400">
                  Hóa Đơn
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-green-400">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <SignOutButton />
              </li>
            </>
          ) : isLoggedIn && userRole == "0" ? (
            <>
              {/* For User (userRole = 0) */}
              
              <li>
                <Link to="/my-orders" className="hover:text-green-400">
                  Đơn Hàng Của Tôi
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-green-400">
                  Giỏ Hàng
                </Link>
              </li>
              <li>
                <SignOutButton />
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-green-400">
                Đăng nhập
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
