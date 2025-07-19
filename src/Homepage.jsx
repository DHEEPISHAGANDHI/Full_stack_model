import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [strength, setStrength] = useState({ level: '', text: '' });
  const [showSavedPasswords, setShowSavedPasswords] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Manual password entry states
  const [manualPassword, setManualPassword] = useState('');
  const [manualAccount, setManualAccount] = useState('');
  const [manualAccountName, setManualAccountName] = useState('');

  const navigate = useNavigate();

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
    'Discord',
    'Spotify',
    'Custom'
  ];

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadSavedPasswords(parsedUser.email);
    }
  }, []);

  // Load saved passwords from database
  const loadSavedPasswords = async (userEmail) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/passwords/${userEmail}`);
      if (response.ok) {
        const passwords = await response.json();
        setSavedPasswords(passwords);
      } else {
        console.error('Failed to load passwords');
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
      alert('Failed to load saved passwords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save password to database
  const savePasswordToDatabase = async (passwordData) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/save-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          account: passwordData.account,
          password: passwordData.password,
          type: passwordData.type,
          strength: passwordData.strength,
          timestamp: passwordData.timestamp
        })
      });

      if (response.ok) {
        // Reload passwords from database
        await loadSavedPasswords(user.email);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save password');
      }
    } catch (error) {
      console.error('Error saving password:', error);
      alert('Failed to save password. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete password from database
  const deletePasswordFromDatabase = async (passwordId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/delete-password/${passwordId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Reload passwords from database
        await loadSavedPasswords(user.email);
        return true;
      } else {
        throw new Error('Failed to delete password');
      }
    } catch (error) {
      console.error('Error deleting password:', error);
      alert('Failed to delete password. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setSavedPasswords([]);
    navigate('/');
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

  const copyPassword = async (passwordToCopy = password) => {
    if (passwordToCopy) {
      try {
        await navigator.clipboard.writeText(passwordToCopy);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (err) {
        alert('Failed to copy password. Please copy manually.');
      }
    } else {
      alert('No password to copy!');
    }
  };

  const saveGeneratedPassword = async () => {
    if (!user) {
      alert('Please log in to save passwords.');
      return;
    }

    if (!password) {
      alert('No password to save! Generate a password first.');
      return;
    }

    const finalAccountName = selectedAccount === 'Custom' ? accountName : selectedAccount;
    
    if (!finalAccountName) {
      alert('Please select or enter an account name.');
      return;
    }

    const passwordData = {
      account: finalAccountName,
      password: password,
      timestamp: new Date().toLocaleString(),
      strength: strength.text,
      type: 'Generated'
    };

    const success = await savePasswordToDatabase(passwordData);
    if (success) {
      alert(`Password saved successfully for ${finalAccountName}!`);
      
      // Reset form
      setSelectedAccount('');
      setAccountName('');
      setPassword('');
      setStrength({ level: '', text: '' });
    }
  };

  const saveManualPassword = async () => {
    if (!user) {
      alert('Please log in to save passwords.');
      return;
    }

    if (!manualPassword) {
      alert('Please enter a password.');
      return;
    }

    const finalAccountName = manualAccount === 'Custom' ? manualAccountName : manualAccount;
    
    if (!finalAccountName) {
      alert('Please select or enter an account name.');
      return;
    }

    // Calculate strength for manual password
    // Ensure this is updated to use manualPassword, not the global 'password' state
    const currentManualStrength = (() => {
      let score = 0;
      if (manualPassword.length >= 8) score++;
      if (manualPassword.length >= 12) score++;
      if (/[a-z]/.test(manualPassword)) score++;
      if (/[A-Z]/.test(manualPassword)) score++;
      if (/[0-9]/.test(manualPassword)) score++;
      if (/[^A-Za-z0-9]/.test(manualPassword)) score++;
      if (manualPassword.length >= 16) score++;

      if (score <= 3) return 'Weak Password';
      else if (score <= 5) return 'Medium Password';
      else return 'Strong Password';
    })();


    const passwordData = {
      account: finalAccountName,
      password: manualPassword,
      timestamp: new Date().toLocaleString(),
      strength: currentManualStrength, // Use the strength calculated specifically for manualPassword
      type: 'Manual'
    };

    const success = await savePasswordToDatabase(passwordData);
    if (success) {
      alert(`Password saved successfully for ${finalAccountName}!`);
      
      // Reset form
      setManualAccount('');
      setManualAccountName('');
      setManualPassword('');
      setShowAddPassword(false);
      setStrength({ level: '', text: '' }); // Reset strength indicator after saving
    }
  };

  const deletePassword = async (passwordId) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      await deletePasswordFromDatabase(passwordId);
    }
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

  const handleManualPasswordChange = (e) => {
    const newPassword = e.target.value;
    setManualPassword(newPassword);
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
    <div className="homepage-container">
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

      {/* Header */}
      <div className="header">
        <h1>🔐 SecureVault</h1> {/* Changed name here */}
        <div className="nav-links">
          {user ? (
            <div className="user-info">
              <span className="welcome-text">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            // Removed Login/Sign Up links from here when not logged in
            // They will only appear in the centered prompt now
            null
          )}
        </div>
      </div>

      <div className="main-content">
        {!user && (
          <div className="login-prompt-wrapper"> {/* New wrapper for centering */}
            <div className="prompt-box">
              <h2>🔐 Welcome to SecureVault</h2> {/* Updated title here too */}
              <p>Please log in or sign up to save and manage your passwords securely.</p>
              <div className="prompt-buttons">
                <Link to="/login" className="prompt-btn login-prompt-btn">Login</Link>
                <Link to="/signup" className="prompt-btn signup-prompt-btn">Sign Up</Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - only show if user is logged in */}
        {user && (
          <div className="action-buttons">
            <button 
              className={`action-tab ${!showAddPassword ? 'active' : ''}`}
              onClick={() => setShowAddPassword(false)}
            >
              🔐 Generate Password
            </button>
            <button 
              className={`action-tab ${showAddPassword ? 'active' : ''}`}
              onClick={() => setShowAddPassword(true)}
            >
              ➕ Add Existing Password
            </button>
          </div>
        )}

        {user && !showAddPassword && (
          /* Password Generator Section */
          <div className="generator-section">
            <div className="generator-box">
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
                
                <div className="checkbox-grid">
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
                🎲 Generate New Password
              </button>

              {/* Large Password Display */}
              <div className="password-display">
                <h3>Generated Password:</h3>
                <div className="large-password-container">
                  <textarea 
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Generated password will appear here..."
                    className="large-password-input"
                    rows="3"
                  />
                  <button onClick={() => copyPassword()} className="copy-btn">
                    {copyStatus || '📋 Copy'}
                  </button>
                </div>
                
                {strength.text && (
                  <div className={`strength-indicator strength-${strength.level}`}>
                    {strength.text}
                  </div>
                )}
              </div>

              {/* Account Selection for Generated Password */}
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

                <button 
                  onClick={saveGeneratedPassword} 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? '⏳ Saving...' : '💾 Save Generated Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {user && showAddPassword && (
          /* Add Existing Password Section */
          <div className="add-password-section">
            <div className="generator-box">
              <h2>Add Existing Password</h2>
              
              <div className="manual-password-form">
                <h3>Enter Password Details:</h3>
                
                {/* Manual Password Input */}
                <div className="password-display">
                  <label>Password:</label>
                  <div className="large-password-container">
                    <textarea 
                      value={manualPassword}
                      onChange={handleManualPasswordChange}
                      placeholder="Enter your existing password..."
                      className="large-password-input"
                      rows="3"
                    />
                    <button onClick={() => copyPassword(manualPassword)} className="copy-btn">
                      {copyStatus || '📋 Copy'}
                    </button>
                  </div>
                  
                  {manualPassword && strength.text && (
                    <div className={`strength-indicator strength-${strength.level}`}>
                      {strength.text}
                    </div>
                  )}
                </div>

                {/* Account Selection for Manual Password */}
                <div className="account-section">
                  <h3>Account:</h3>
                  <select 
                    value={manualAccount}
                    onChange={(e) => setManualAccount(e.target.value)}
                    className="account-select"
                  >
                    <option value="">Select Account</option>
                    {accountOptions.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                  
                  {manualAccount === 'Custom' && (
                    <input 
                      type="text"
                      placeholder="Enter custom account name"
                      value={manualAccountName}
                      onChange={(e) => setManualAccountName(e.target.value)}
                      className="custom-account-input"
                    />
                  )}

                  <button 
                    onClick={saveManualPassword} 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? '⏳ Saving...' : '💾 Save Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Passwords Section - only show if user is logged in */}
        {user && (
          <div className="saved-passwords-section">
            <button 
              onClick={() => setShowSavedPasswords(!showSavedPasswords)}
              className="toggle-saved-btn"
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : 
                `${showSavedPasswords ? '🔼 Hide' : '🔽 Show'} Saved Passwords (${savedPasswords.length})`
              }
            </button>

            {showSavedPasswords && (
              <div className="saved-passwords">
                {savedPasswords.length === 0 ? (
                  <p className="no-passwords">No passwords saved yet. Generate or add a password to get started!</p>
                ) : (
                  <div className="passwords-grid">
                    {savedPasswords.map(item => (
                      <div key={item._id} className="password-card">
                        <div className="card-header">
                          <h4>{item.account}</h4>
                          <span className="password-type">{item.type}</span>
                        </div>
                        <div className="password-text">{item.password}</div>
                        <div className="card-info">
                          <small>{item.timestamp}</small>
                          <span className={`strength-badge strength-${item.strength.toLowerCase().split(' ')[0]}`}>
                            {item.strength}
                          </span>
                        </div>
                        <div className="card-actions">
                          <button 
                            onClick={() => copyPassword(item.password)}
                            className="action-btn copy-action"
                          >
                            📋 Copy
                          </button>
                          <button 
                            onClick={() => deletePassword(item._id)}
                            className="action-btn delete-action"
                            disabled={loading}
                          >
                            {loading ? '⏳' : '🗑️'} Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;