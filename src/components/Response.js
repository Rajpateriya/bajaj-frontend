import React from "react";

const ResopnseComponent = ({ response, selectedOptions }) => {
  const { alphabets, numbers, highest_lowercase_alphabet } = response;

  const filteredResponse = {};
  if (selectedOptions.includes("Alphabets")) filteredResponse.alphabets = alphabets;
  if (selectedOptions.includes("Numbers")) filteredResponse.numbers = numbers;
  if (selectedOptions.includes("Highest Lowercase Alphabet"))
    filteredResponse.highest_lowercase_alphabet = highest_lowercase_alphabet;

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Filtered Response:</h2>
      <pre className="bg-gray-200 p-2 rounded text-sm text-gray-700">
        {JSON.stringify(filteredResponse, null, 2)}
      </pre>
    </div>
  );
};

export default ResopnseComponent;
