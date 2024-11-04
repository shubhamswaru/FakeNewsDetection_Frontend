'use client'
import { useState } from 'react';

export default function Example() {
  const [inputType, setInputType] = useState('url'); // Default to URL
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(''); // State for storing "Fake" or "Not Fake"
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const handleInputChange = (e) => {
    if (inputType === 'url') {
      setUrl(e.target.value);
    } else {
      setText(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = inputType === 'url' ? { type: 'url', content: url } : { type: 'text', content: text };

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setResult(result.verdict); // Update to reflect new API response structure
        setShowModal(true); // Show modal with the result
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => setShowModal(false); // Close modal function

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-cover bg-center" 
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply')` }}>
      
      <form className='p-12 md:p-16 lg:p-20 bg-gray-800 rounded-lg shadow-lg max-w-xl w-full' onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-white text-center">Fake News Detection</h2>
          <p className="text-sm text-gray-400 text-center">
            Select an option to classify content as fake or not fake news.
          </p>

          {/* Input Type Selection */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-white">Select Input Type</label>
              <div className="flex space-x-4 mt-2 justify-center">
                <div>
                  <input
                    type="radio"
                    id="url"
                    name="inputType"
                    value="url"
                    checked={inputType === 'url'}
                    onChange={() => setInputType('url')}
                    className="mr-2 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="url" className="text-sm text-white">URL</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="text"
                    name="inputType"
                    value="text"
                    checked={inputType === 'text'}
                    onChange={() => setInputType('text')}
                    className="mr-2 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="text" className="text-sm text-white">Text</label>
                </div>
              </div>
            </div>

            {/* URL or Text Input */}
            <div className="sm:col-span-4">
              {inputType === 'url' ? (
                <>
                  <label htmlFor="website" className="block text-sm font-medium text-white">Website URL</label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="website"
                        name="website"
                        type="text"
                        placeholder="www.example.com"
                        value={url}
                        onChange={handleInputChange}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="about" className="block text-sm font-medium text-white">Text Content</label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      value={text}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      placeholder="Paste your text content here..."
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-400">Write the text you want to classify.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-gray-400">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Modal for Displaying Results */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg text-black font-bold mb-4">Prediction Result</h3>
            <p className={`text-center text-2xl font-bold ${result === 'Not A Fake News' ? 'text-green-600' : 'text-red-600'}`}>
              {result === 'Not A Fake News' ? '🟢 This news is Not Fake' : '🔴 This news is Fake'}
            </p>

            <button
              onClick={closeModal}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
