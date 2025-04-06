import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const passRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [passName, setPassName] = useState('');
  const [savedPasswords, setSavedPasswords] = useState(
    JSON.parse(localStorage.getItem('savedpasswords')) || []
  );

  useEffect(() => {
    localStorage.setItem('savedpasswords', JSON.stringify(savedPasswords));
  }, [savedPasswords]);

  const item = {
    id: Date.now(),
    name: passName,
    password: password
  };

  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed]);

  function copy() {
    passRef.current.select();
    navigator.clipboard.writeText(passRef.current.value);
  }

  function generatePassword() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += '0123456789';
    if (charAllowed) str += '!@#$%^&*()_+{}[]<>?.~';
    for (let i = 0; i < length; i++) {
      pass += str.charAt(Math.floor(Math.random() * str.length));
    }
    setPassword(pass);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Password Generator
        </h1>

        {/* Password Display */}
        <div className="relative mb-6">
          <input
            type="text"
            value={password}
            readOnly
            ref={passRef}
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={copy}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Copy
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-white font-medium flex-1">
              Length: {length}
            </label>
            <input
              type="range"
              min={7}
              max={30}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="flex justify-between">
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="accent-indigo-500"
              />
              Numbers
            </label>
            <label className="text-white flex items-center gap-2">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="accent-indigo-500"
              />
              Symbols
            </label>
          </div>
        </div>

        {/* Saved Passwords */}
        {savedPasswords.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Saved Passwords
            </h2>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {savedPasswords.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-800/50 p-2 rounded-md text-white"
                >
                  <span>
                    {item.name}: {item.password}
                  </span>
                  <button
                    onClick={() =>
                      setSavedPasswords(
                        savedPasswords.filter((pass) => pass.id !== item.id)
                      )
                    }
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-white text-lg font-semibold mb-4">
              Save Password
            </h2>
            <input
              type="text"
              value={passName}
              onChange={(e) => setPassName(e.target.value)}
              placeholder="Enter password name"
              className="w-full p-2 bg-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSavedPasswords([...savedPasswords, item]);
                  setShowModal(false);
                  setPassName('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;