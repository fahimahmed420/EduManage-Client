import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaArrowUp, FaGraduationCap } from "react-icons/fa";

import { useEffect, useState } from "react";

const Footer = () => {
    const [showScroll, setShowScroll] = useState(false);

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

    return (
        <>
            <footer className="bg-blue-600 text-white relative">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div>
                        <Link to={"/"}><h2 className="text-2xl font-bold mb-3 flex items-center gap-2"><FaGraduationCap />EduManage</h2></Link>
                        <p className="text-sm text-white/80">
                            Empowering learning through seamless class management and teacher-student collaboration.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-white/90 text-sm">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/all-classes">All Classes</Link></li>
                            <li><Link to="/teach">Teach on EduManage</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Support</h3>
                        <ul className="space-y-2 text-white/90 text-sm">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Contact</h3>
                        <p className="text-white/90 text-sm">Email: support@edumanage.com</p>
                        <p className="text-white/90 text-sm mt-1">Phone: +880 123 456 789</p>
                        <div className="flex gap-4 mt-4 text-white">
                            <a href="#"><FaFacebookF className="hover:text-gray-300 transition" /></a>
                            <a href="#"><FaTwitter className="hover:text-gray-300 transition" /></a>
                            <a href="#"><FaLinkedinIn className="hover:text-gray-300 transition" /></a>
                            <a href="#"><FaInstagram className="hover:text-gray-300 transition" /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom with animation */}
                <div className="bg-blue-700 overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee text-sm text-white/80 py-4">
                        &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
                        &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
                        &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
                        &copy; {new Date().getFullYear()} EduManage. All rights reserved. &nbsp;&nbsp;&nbsp;
                    </div>
                </div>



                {/* Scroll to top */}
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
        </>
    );
};

export default Footer;
