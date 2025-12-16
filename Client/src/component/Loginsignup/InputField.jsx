
/**
 * props:
 *  - label
 *  - type
 *  - placeholder
 *  - icon (React component)
 *  - required (boolean)
 */
const InputField = ({ label, type = "text", placeholder = "", icon: Icon, required = false, name,value,onChange }) => {
  return (
    <div className="w-full mb-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 group-focus-within:text-red-600 transition-colors">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input
          name={name}
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}       
          onChange={onChange}
          className={`w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 
            focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition-all duration-200
            ${Icon ? "pl-11" : ""}`}
        />
      </div>
    </div>
  );
};

export default InputField;
