

const Checkbox = ({ label, name, required = false }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mb-3 group select-none">
      <div className="relative flex items-center">
        <input
          name={name}
          required={required}
          type="checkbox"
          className="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-red-600 checked:border-red-600 focus:ring-2 focus:ring-red-500/30 transition-all cursor-pointer"
        />
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
  );
};

export default Checkbox;
