import React from "react";
import { FaBullseye, FaCertificate, FaChartLine, FaStar } from "react-icons/fa";

const CareerInvestSection = () => {
    const items = [
        {
            icon: <FaBullseye className="text-3xl text-blue-600 mb-2" />,
            title: "Explore new skills",
            description:
                "Access 10+ courses in AI, business, technology, and more.",
        },
        {
            icon: <FaCertificate className="text-3xl text-green-600 mb-2" />,
            title: "Earn valuable credentials",
            description:
                "Get certificates for every course you finish and boost your chances of getting hired at no extra cost.",
        },
        {
            icon: <FaStar className="text-3xl text-yellow-500 mb-2" />,
            title: "Learn from the best",
            description:
                "Take your skills to the next level with expert-led courses and AI-powered guidance.",
        },
    ];

    return (
        <section className="pt-10 pb-28">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-8 flex items-center justify-center gap-3">
                    <FaChartLine className="text-blue-600 w-8 h-8" />
                    Invest in your career
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                            {item.icon}
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareerInvestSection;
