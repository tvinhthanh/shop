import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md relative z-10 ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="/">ShopLogo</a>
        </div>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <li>
            <a
              href="/"
              className="hover:text-green-400 transition duration-200"
            >
              Trang Chủ
            </a>
          </li>
          <li>
            <a
              href="/products"
              className="hover:text-green-400 transition duration-200"
            >
              Sản Phẩm
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="hover:text-green-400 transition duration-200"
            >
              Về Chúng Tôi
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="hover:text-green-400 transition duration-200"
            >
              Liên Hệ
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="hover:text-green-400 transition duration-200"
            >
              Đăng nhập
            </a>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-gray-300">
          <button id="mobile-menu-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
