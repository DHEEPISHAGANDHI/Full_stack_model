import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [strength, setStrength] = useState({ level: '', text: '' });
  const [showSavedPasswords, setShowSavedPasswords] = useState(false);

  // Popular account options
  const accountOptions = [
    'GitHub',
    'Facebook',
    'LinkedIn',
    'Twitter',
    'Instagram',
    'Google',
    'Microsoft',
    'Apple',
    'Amazon',
    'Netflix',
    'Custom'
  ];

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Generate password function
  const generatePassword = () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      alert('Please select at least one character type!');
      return;
    }

    let charset = '';
    let guaranteedChars = '';

    if (includeUppercase) {
      charset += charSets.uppercase;
      guaranteedChars += getRandomChar(charSets.uppercase);
    }
    if (includeLowercase) {
      charset += charSets.lowercase;
      guaranteedChars += getRandomChar(charSets.lowercase);
    }
    if (includeNumbers) {
      charset += charSets.numbers;
      guaranteedChars += getRandomChar(charSets.numbers);
    }
    if (includeSymbols) {
      charset += charSets.symbols;
      guaranteedChars += getRandomChar(charSets.symbols);
    }

    let generatedPassword = guaranteedChars;

    // Fill the rest randomly
    for (let i = guaranteedChars.length; i < length; i++) {
      generatedPassword += getRandomChar(charset);
    }

    // Shuffle the password
    generatedPassword = shuffleString(generatedPassword);
    setPassword(generatedPassword);
    updateStrengthIndicator(generatedPassword);
  };

  const getRandomChar = (str) => {
    return str.charAt(Math.floor(Math.random() * str.length));
  };

  const shuffleString = (str) => {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  };

  const updateStrengthIndicator = (pass) => {
    let score = 0;
    
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (pass.length >= 16) score++;

    if (score <= 3) {
      setStrength({ level: 'weak', text: 'Weak Password' });
    } else if (score <= 5) {
      setStrength({ level: 'medium', text: 'Medium Password' });
    } else {
      setStrength({ level: 'strong', text: 'Strong Password' });
    }
  };

  const copyPassword = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (err) {
        alert('Failed to copy password. Please copy manually.');
      }
    } else {
      alert('No password to copy! Generate a password first.');
    }
  };

  const savePassword = () => {
    if (!password) {
      alert('No password to save! Generate or enter a password first.');
      return;
    }

    const finalAccountName = selectedAccount === 'Custom' ? accountName : selectedAccount;
    
    if (!finalAccountName) {
      alert('Please select or enter an account name.');
      return;
    }

    const newPasswordEntry = {
      id: Date.now(),
      account: finalAccountName,
      password: password,
      timestamp: new Date().toLocaleString(),
      strength: strength.text
    };

    setSavedPasswords([...savedPasswords, newPasswordEntry]);
    alert(`Password saved successfully for ${finalAccountName}!\n\nTotal saved passwords: ${savedPasswords.length + 1}`);
    
    // Reset form
    setSelectedAccount('');
    setAccountName('');
    setPassword('');
    setStrength({ level: '', text: '' });
  };

  const deletePassword = (id) => {
    setSavedPasswords(savedPasswords.filter(item => item.id !== id));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      updateStrengthIndicator(newPassword);
    } else {
      setStrength({ level: '', text: '' });
    }
  };

  // Generate initial password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="auth-container">
      {/* Background animations */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="auth-box password-generator-box">
        <h2>Password Generator</h2>
        
        {/* Password Options */}
        <div className="password-options">
          <div className="option-group">
            <label>Length: {length}</label>
            <input 
              type="range" 
              min="4" 
              max="50" 
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="length-slider"
            />
          </div>
          
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="uppercase" 
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <label htmlFor="uppercase">Uppercase Letters (A-Z)</label>
            </div>
            
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="lowercase" 
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <label htmlFor="lowercase">Lowercase Letters (a-z)</label>
            </div>
            
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="numbers" 
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <label htmlFor="numbers">Numbers (0-9)</label>
            </div>
            
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="symbols" 
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <label htmlFor="symbols">Special Characters (!@#$%^&*)</label>
            </div>
          </div>
        </div>

        <button onClick={generatePassword} className="generate-btn">
          Generate Password
        </button>

        {/* Password Display */}
        <div className="password-display">
          <div className="password-container">
            <input 
              type="text" 
              value={password}
              onChange={handlePasswordChange}
              placeholder="Generated password will appear here"
              className="password-input"
            />
            <button onClick={copyPassword} className="copy-btn">
              {copyStatus || 'Copy'}
            </button>
          </div>
          
          {strength.text && (
            <div className={`strength-indicator strength-${strength.level}`}>
              {strength.text}
            </div>
          )}
        </div>

        {/* Account Selection */}
        <div className="account-section">
          <h3>Save Password For:</h3>
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="account-select"
          >
            <option value="">Select Account</option>
            {accountOptions.map(account => (
              <option key={account} value={account}>{account}</option>
            ))}
          </select>
          
          {selectedAccount === 'Custom' && (
            <input 
              type="text"
              placeholder="Enter custom account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="custom-account-input"
            />
          )}
        </div>

        <button onClick={savePassword} className="save-btn">
          Save Password
        </button>

        {/* Saved Passwords Toggle */}
        <button 
          onClick={() => setShowSavedPasswords(!showSavedPasswords)}
          className="toggle-saved-btn"
        >
          {showSavedPasswords ? 'Hide' : 'Show'} Saved Passwords ({savedPasswords.length})
        </button>

        {/* Saved Passwords List */}
        {showSavedPasswords && (
          <div className="saved-passwords">
            <h3>Saved Passwords:</h3>
            {savedPasswords.length === 0 ? (
              <p className="no-passwords">No passwords saved yet.</p>
            ) : (
              <div className="passwords-list">
                {savedPasswords.map(item => (
                  <div key={item.id} className="password-item">
                    <div className="password-info">
                      <strong>{item.account}</strong>
                      <span className="password-text">{item.password}</span>
                      <small>{item.timestamp}</small>
                      <span className={`strength-badge strength-${item.strength.toLowerCase().split(' ')[0]}`}>
                        {item.strength}
                      </span>
                    </div>
                    <div className="password-actions">
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.password)}
                        className="action-btn copy-action"
                      >
                        Copy
                      </button>
                      <button 
                        onClick={() => deletePassword(item.id)}
                        className="action-btn delete-action"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="back-link">
          <Link to="/signup">← Back to Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordGenerator;