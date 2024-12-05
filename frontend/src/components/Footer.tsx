const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-300">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
        ShopLogo
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm mt-4 md:mt-0">
          <a href="/privacy-policy" className="hover:text-green-400 cursor-pointer">
            Chính sách bảo mật
          </a>
          <a href="/terms-of-service" className="hover:text-green-400 cursor-pointer">
            Điều khoản dịch vụ
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm mt-4 md:mt-0 text-center md:text-right">
          &copy; {new Date().getFullYear()} Trần Quốc Nam và Phạm Anh Tuấn. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;