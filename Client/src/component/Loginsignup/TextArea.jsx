

const TextArea = ({ label, required = false, name ,value, onChange }) => {
  return (
    <div className="w-full mb-4 group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 group-focus-within:text-red-600 transition-colors">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea name={name} required={required} value={value}       
          onChange={onChange} rows="3" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 
          focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition-all duration-200 resize-none"
      />
    </div>
  );
};

export default TextArea;
