import React from "react";

const Dropdown = ({ options, selectedOptions, handleChange }) => {
  const handleSelectChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);

    // If "All" is selected, override other selections and show all
    if (selected.includes("All")) {
      handleChange(["All"]);
    } else {
      handleChange(selected);
    }
  };

  return (
    <div className="my-4">
      <label htmlFor="multi-select" className="block text-sm font-medium text-gray-700">
        Multi Filter:
      </label>
      <select
        id="multi-select"
        multiple
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        value={selectedOptions}
        onChange={handleSelectChange}
      >
        <option value="All">All</option> {/* Add "All" option */}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
