import React, { useState } from "react";
import Dropdown from "./components/Dropdown";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["All"]);
  const dropdownOptions = ["Numbers", "Alphabets", "Highest Lowercase Alphabet", "file_size", "file_type",  "All"];

  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateJSON(jsonInput)) {
      setError("Invalid JSON format");
      return;
    }
    setError(""); // Clear errors
    try {
      const res = await axios.post(`https://bajaj-backend-9152.onrender.com/bfhl`, JSON.parse(jsonInput), {
        headers: { "Content-Type": "application/json" },
      });
      setResponse(res.data); // Set backend response
    } catch (err) {
      console.error("Error calling backend API:", err);
      setError(err.response?.data?.message || "Error connecting to backend");
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    if (selectedOptions.includes("All")) {
      return (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold text-lg">Filtered Response:</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      );
    }

    const filteredResponse = {};
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }
    if(selectedOptions.includes("file_size")){
      filteredResponse.file_size = response.file_size_kb;
    }
    if(selectedOptions.includes("file_type")){
      filteredResponse.file_type = response.file_mime_type;
    }

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold text-lg">Filtered Response:</h3>
        <pre className="mt-2 text-sm">{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <title></title>
        <h1 className="text-3xl font-bold text-red-600 text-center">0101CS211100</h1>
      </header>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
        <label htmlFor="json-input" className="block text-sm font-medium text-gray-700">
          API Input:
        </label>
        <textarea
          id="json-input"
          rows="5"
          placeholder='{"data":["M","1","334","4","B"]}'
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <h1>Filters: </h1>
      {response && (
        <>
          <Dropdown
            options={dropdownOptions}
            selectedOptions={selectedOptions}
            handleChange={setSelectedOptions}
          />
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
};

export default App;
