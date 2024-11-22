import React, { useState, useEffect } from 'react';
import './JsonProcessor.css';

const JsonProcessor = () => {
  const [inputJson, setInputJson] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('json');

  // Set document title
  useEffect(() => {
    document.title = "YOUR_ROLL_NUMBER"; // Replace with actual roll number
  }, []);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase', label: 'Highest lowercase alphabet' }
  ];

  const validateAndParseJSON = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Input must contain a "data" array');
      }
      return parsed;
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        event.target.value = null;
        return;
      }
      setSelectedFile(file);
      setError('');
      
      setFileDetails({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'Unknown'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let validJson = inputJson ? validateAndParseJSON(inputJson) : { data: [] };
      
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('data', JSON.stringify(validJson.data));

      const response = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: {
          'user_id': 'test_user',
          'email': 'test@example.com',
          'roll_number': 'test_roll',
          'filename': selectedFile?.name || 'no_file'
        },
        body: formData
      });

      const data = await response.json();
      if (data.is_success) {
        setResponse(data);
        setSelectedOptions(['alphabets', 'numbers']);
      } else {
        throw new Error(data.error || 'Failed to process data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      e.target.checked
        ? [...selectedOptions, value]
        : selectedOptions.filter(option => option !== value)
    );
  };

  const renderFileInfo = () => {
    if (!response?.file_valid) return null;
    
    return (
      <div className="file-info">
        <h3>File Information:</h3>
        <div className="info-content">
          <p><span>Name:</span> {response.filename}</p>
          <p><span>Size:</span> {response.file_size_kb} KB</p>
          <p><span>Type:</span> {response.file_mime_type}</p>
        </div>
      </div>
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return (
      <div className="response-section">
        {renderFileInfo()}
        
        {selectedOptions.includes('alphabets') && response.alphabets.length > 0 && (
          <div className="result-box">
            <h3>Alphabets:</h3>
            <p>{response.alphabets.join(', ')}</p>
          </div>
        )}
        
        {selectedOptions.includes('numbers') && response.numbers.length > 0 && (
          <div className="result-box">
            <h3>Numbers:</h3>
            <p>{response.numbers.join(', ')}</p>
          </div>
        )}
        
        {selectedOptions.includes('highest_lowercase') && response.highest_lowercase_alphabet.length > 0 && (
          <div className="result-box">
            <h3>Highest Lowercase Alphabet:</h3>
            <p>{response.highest_lowercase_alphabet[0]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="processor-container">
      <div className="processor-card">
        <h2>Data Processor</h2>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Input
          </button>
          <button 
            className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            File Upload
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'json' && (
            <div className="input-section">
              <label>Enter JSON Input:</label>
              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder='{"data": ["A", "1", "B", "2", "z"]}'
              />
            </div>
          )}

          {activeTab === 'file' && (
            <div className="input-section">
              <label>Upload File (Max 10MB):</label>
              <div className="file-upload">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".txt,.js,.html,.css,.json"
                  id="file-input"
                />
                <label htmlFor="file-input" className="file-label">
                  Select a file
                </label>
              </div>
              {fileDetails && (
                <div className="file-details">
                  <h3>Selected File:</h3>
                  <div className="info-content">
                    <p><span>Name:</span> {fileDetails.name}</p>
                    <p><span>Size:</span> {fileDetails.size}</p>
                    <p><span>Type:</span> {fileDetails.type}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {response && (
          <div className="response-container">
            <div className="success-message">
              Data processed successfully!
            </div>

            <div className="options-section">
              <label>Select data to display:</label>
              <div className="checkbox-group">
                {options.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedOptions.includes(option.value)}
                      onChange={handleOptionChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {renderFilteredResponse()}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonProcessor;