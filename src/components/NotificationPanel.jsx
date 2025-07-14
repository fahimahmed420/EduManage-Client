const NotificationPanel = () => {
  const notifications = [
    { id: 1, text: "For now notification bar will not work.I will work on it later.", time: "0h ago" },
  ];

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-white shadow-md p-6 min-h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Notifications</h2>
      <ul className="space-y-4 text-sm">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="bg-blue-50 hover:bg-blue-100 p-3 rounded-md transition"
          >
            <p className="text-blue-900">{n.text}</p>
            <span className="text-xs text-gray-500">{n.time}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NotificationPanel;
