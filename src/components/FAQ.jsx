// src/components/FAQ.jsx
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What is EduManage?",
    answer:
      "EduManage is a modern platform that connects students, tutors, and educational institutions to manage classes, assignments, and learning progress efficiently.",
  },
  {
    question: "How can I enroll in a class?",
    answer:
      "To enroll in a class, go to the All Classes page, choose an approved course, and click Enroll. You’ll be redirected to the payment and class details page.",
  },
  {
    question: "How do I apply to teach?",
    answer:
      "Click on 'Teach on EduManage' in the navbar, fill out the form, and submit your application. Admins will review and approve qualified requests.",
  },
  {
    question: "Is there a mobile-friendly version?",
    answer:
      "Yes, EduManage is fully responsive and optimized for mobile, tablet, and desktop devices.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support various payment methods through secure gateways. You’ll be guided through the process on the class details page after clicking Enroll.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border border-blue-100 rounded-lg shadow-sm transition-all duration-300 bg-white">
            <button
              onClick={() => toggle(index)}
              className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-medium text-blue-800 hover:bg-blue-50"
            >
              <span>{item.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-700 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
