const StatsCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);
export default StatsCard;
