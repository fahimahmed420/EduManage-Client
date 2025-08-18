import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
  FaGraduationCap,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const openModal = (type) => {
    if (type === "contact") {
      setModalContent(`📞 Contact us at support@edumanage.com or call +880 123456789.`);
    } else if (type === "terms") {
      setModalContent("📃 Terms of Service: Usage of EduManage is subject to our policies and guidelines.");
    }
  };

  const closeModal = () => setModalContent(null);

  return (
    <>
      <footer className="bg-blue-600 text-white relative">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link to={"/"}>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <FaGraduationCap />
                EduManage
              </h3>
            </Link>
            <h3 className="text-sm">
              Empowering learning through seamless class management and teacher-student collaboration.
            </h3>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/all-classes">All Classes</Link></li>
              <li><Link to="/teach">Teach on EduManage</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><button className="cursor-pointer" onClick={() => openModal("contact")}>Contact Us</button></li>
              <li><button className="cursor-pointer" onClick={() => openModal("terms")}>Terms of Service</button></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <h3 className="text-sm">Email: support@edumanage.com</h3>
            <h3 className="text-sm mt-1">Phone: +880 123456789</h3>
            <div className="flex gap-4 mt-4 text-white">
              <a href="#"><FaFacebookF className="hover:text-gray-300 transition" /></a>
              <a href="#"><FaTwitter className="hover:text-gray-300 transition" /></a>
              <a href="#"><FaLinkedinIn className="hover:text-gray-300 transition" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="bg-blue-700 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-sm text-white/80 py-4">
            &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
            &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
            &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
          </div>
        </div>

        {/* Scroll to Top */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-gray-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition z-50"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </button>
        )}
      </footer>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg max-w-md w-full shadow-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
            <p className="text-center text-base">{modalContent}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
