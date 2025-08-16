import React from "react";
import { FaUsers, FaLock, FaChalkboardTeacher, FaChartLine, FaBookOpen, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
    return (
        <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl md:text-5xl font-bold text-blue-600"
                >
                    About Us
                </motion.h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">
                    We are a comprehensive <span className="font-semibold">full-stack e-learning platform</span>
                    offering courses in <span className="text-blue-600">Web Development</span>,
                    <span className="text-blue-600"> UI/UX Design</span>, and
                    <span className="text-blue-600"> Artificial Intelligence</span>.
                    Our mission is to deliver a smooth and engaging learning experience
                    that empowers students and instructors worldwide.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h2>
                    <p>
                        To provide learners with high-quality, accessible education
                        that blends cutting-edge technology with practical, hands-on knowledge.
                        We aim to bridge the gap between education and industry needs.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h2>
                    <p>
                        To become the global hub for digital learning where anyone can
                        master skills, track real-time progress, and collaborate with mentors,
                        building a brighter future together.
                    </p>
                </motion.div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-10">
                    What Makes Us Unique
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: <FaLock className="text-blue-500 text-4xl mb-4" />,
                            title: "Secure Authentication",
                            desc: "Advanced security with role-based access for students and instructors.",
                        },
                        {
                            icon: <FaChalkboardTeacher className="text-blue-500 text-4xl mb-4" />,
                            title: "Course Management",
                            desc: "Easily manage, update, and publish courses with modern tools.",
                        },
                        {
                            icon: <FaChartLine className="text-blue-500 text-4xl mb-4" />,
                            title: "Real-Time Tracking",
                            desc: "Track progress and performance instantly with interactive dashboards.",
                        },
                        {
                            icon: <FaUsers className="text-blue-500 text-4xl mb-4" />,
                            title: "Community Learning",
                            desc: "Engage with peers and instructors to enhance collaboration.",
                        },
                        {
                            icon: <FaBookOpen className="text-blue-500 text-4xl mb-4" />,
                            title: "Diverse Courses",
                            desc: "From web development to AI, explore a wide range of skills.",
                        },
                        {
                            icon: <FaCertificate className="text-blue-500 text-4xl mb-4" />,
                            title: "Course Completion Certificate",
                            desc: "Receive a verified certificate upon completing the course to showcase your achievement.",
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
                        >
                            {feature.icon}
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 py-16 text-white text-center">
                <div className="px-4">
                    <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
                    <p className="max-w-2xl mx-auto mb-6">
                        Start your journey today and gain the skills needed to succeed in
                        the fast-paced digital world.
                    </p>
                    <Link
                        to="/all-classes"
                        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
                    >
                        Get Started
                    </Link>
                    <div className="max-w-7xl mx-auto border-b mt-7" />
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
