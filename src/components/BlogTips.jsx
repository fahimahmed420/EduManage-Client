import { useState } from "react";
import { FaBookOpen } from "react-icons/fa";

const blogPosts = [
  {
    id: 1,
    title: "Top Skills to Learn in 2025",
    excerpt: "Stay ahead with the most in-demand skills for the future.",
    details: (
      <div className="space-y-3 text-gray-700">
        <p>The job market in 2025 is evolving rapidly. Here are the top skills you should focus on:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>AI & Machine Learning:</strong> Automate processes and build intelligent systems.</li>
          <li><strong>Cybersecurity:</strong> Protect systems, networks, and data from attacks.</li>
          <li><strong>Cloud Computing:</strong> Work with AWS, Azure, or GCP for scalable apps.</li>
          <li><strong>Soft Skills:</strong> Communication, critical thinking, and adaptability are in high demand.</li>
        </ul>
        <p>Enroll in relevant courses on EduManage to start building these skills today!</p>
      </div>
    ),
    image: "https://i.ibb.co/tTNFyL8W/skills2.jpg",
  },
  {
    id: 2,
    title: "Mastering Online Learning Habits",
    excerpt: "Proven strategies to stay consistent and focused in remote learning.",
    details: (
      <div className="space-y-3 text-gray-700">
        <p>Online learning can be tough. Here's how to stay on track:</p>
        <ul className="list-decimal list-inside space-y-1">
          <li>Set a dedicated study schedule (same time every day).</li>
          <li>Use Pomodoro technique — 25 mins focus, 5 mins break.</li>
          <li>Keep your phone in another room to avoid distraction.</li>
          <li>Actively participate in discussions and ask questions.</li>
          <li>Track your progress with weekly goals.</li>
        </ul>
        <p>Being consistent is more important than being perfect. Build the habit, and results will follow.</p>
      </div>
    ),
    image: "https://i.ibb.co/MywW780B/Learning-Methods.png",
  },
  {
    id: 3,
    title: "How to Build a Strong Portfolio",
    excerpt: "Craft a professional portfolio that showcases your strengths.",
    details: (
      <div className="space-y-3 text-gray-700">
        <p>A strong portfolio makes a great first impression. Here's how to create one:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Pick Your Best Work:</strong> Quality {'>'} Quantity. Choose 3-5 top projects.</li>
          <li><strong>Use Real Projects:</strong> Clone apps, client work, or real-world problems.</li>
          <li><strong>Include Screenshots or Live Links:</strong> Let visitors see your work in action.</li>
          <li><strong>Describe Tools/Stack:</strong> Mention what tech you used and why.</li>
          <li><strong>Make it Responsive:</strong> Your portfolio should look great on all devices.</li>
        </ul>
        <p>Bonus tip: Keep your GitHub clean and updated — link it on your resume too!</p>
      </div>
    ),
    image: "https://i.ibb.co/JRVDGbF8/portfolio-button-portfolio-speech-bubble-portfolio-colorful-web-banner-illustration-vector.jpg",
  },
];

const BlogTips = () => {
  const [openPost, setOpenPost] = useState(null);

  const handleOpenPost = (post) => {
    setOpenPost(post);
  };

  return (
    <section className=" py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-10 flex items-center justify-center gap-2">
          <FaBookOpen className="text-blue-600 w-8 h-8" />
          Blog & Learning Tips

        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover bg-gray-100 p-2"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">{post.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm">{post.excerpt}</p>
                </div>
                <div className="flex justify-center mt-4">
                 
                  <button
                    onClick={() => handleOpenPost(post)}
                    rel="noopener noreferrer"
                    className="inline-block cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:translate-y-2 px-4 py-2 rounded-full transition"
                  >
                    Read More
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-all duration-300">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpenPost(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-4xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {openPost.title}
            </h2>
            <div className="text-sm">{openPost.details}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogTips;
