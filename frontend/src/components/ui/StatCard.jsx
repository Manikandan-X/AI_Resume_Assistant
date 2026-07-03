const StatCard = ({ label, value, suffix }) => (
  <div className="bg-white rounded-xl shadow-sm border p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">
      {value}
      {suffix && <span className="text-base font-normal text-gray-400"> {suffix}</span>}
    </p>
  </div>
);

export default StatCard;