const InputField = ({ type, id, name, value, onChange, placeholder, label }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputField;