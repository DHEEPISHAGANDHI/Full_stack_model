import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Manual password entry states
  const [manualPassword, setManualPassword] = useState('');
  const [manualAccount, setManualAccount] = useState('');
  const [manualAccountName, setManualAccountName] = useState('');

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

  const saveGeneratedPassword = () => {
    if (!password) {
      alert('No password to save! Generate a password first.');
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
      strength: strength.text,
      type: 'Generated'
    };

    setSavedPasswords([...savedPasswords, newPasswordEntry]);
    alert(`Password saved successfully for ${finalAccountName}!`);
    
    // Reset form
    setSelectedAccount('');
    setAccountName('');
    setPassword('');
    setStrength({ level: '', text: '' });
  };

  const saveManualPassword = () => {
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
    updateStrengthIndicator(manualPassword);

    const newPasswordEntry = {
      id: Date.now(),
      account: finalAccountName,
      password: manualPassword,
      timestamp: new Date().toLocaleString(),
      strength: strength.text,
      type: 'Manual'
    };

    setSavedPasswords([...savedPasswords, newPasswordEntry]);
    alert(`Password saved successfully for ${finalAccountName}!`);
    
    // Reset form
    setManualAccount('');
    setManualAccountName('');
    setManualPassword('');
    setShowAddPassword(false);
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
        <h1>Password Manager</h1>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </div>

      <div className="main-content">
        {/* Action Buttons */}
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

        {!showAddPassword ? (
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

                <button onClick={saveGeneratedPassword} className="save-btn">
                  💾 Save Generated Password
                </button>
              </div>
            </div>
          </div>
        ) : (
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

                  <button onClick={saveManualPassword} className="save-btn">
                    💾 Save Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Passwords Section */}
        <div className="saved-passwords-section">
          <button 
            onClick={() => setShowSavedPasswords(!showSavedPasswords)}
            className="toggle-saved-btn"
          >
            {showSavedPasswords ? '🔼 Hide' : '🔽 Show'} Saved Passwords ({savedPasswords.length})
          </button>

          {showSavedPasswords && (
            <div className="saved-passwords">
              {savedPasswords.length === 0 ? (
                <p className="no-passwords">No passwords saved yet. Generate or add a password to get started!</p>
              ) : (
                <div className="passwords-grid">
                  {savedPasswords.map(item => (
                    <div key={item.id} className="password-card">
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
                          onClick={() => deletePassword(item.id)}
                          className="action-btn delete-action"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Homepage = () => {
//   const [password, setPassword] = useState('');
//   const [criteria, setCriteria] = useState({
//     uppercase: true,
//     lowercase: true,
//     numbers: true,
//     special: true,
//     length: 12
//   });
//   const [savedPasswords, setSavedPasswords] = useState([]);
//   const [showSaveSuccess, setShowSaveSuccess] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState('');
//   const [customAccount, setCustomAccount] = useState('');
//   const [showAccountForm, setShowAccountForm] = useState(false);
//   const [showSavedPasswords, setShowSavedPasswords] = useState(false);
//   const [manualPassword, setManualPassword] = useState('');
//   const [showManualEntry, setShowManualEntry] = useState(false);

//   const predefinedAccounts = [
//     { name: 'GitHub', icon: '🐙' },
//     { name: 'Facebook', icon: '📘' },
//     { name: 'LinkedIn', icon: '💼' },
//     { name: 'Google', icon: '🔍' },
//     { name: 'Twitter', icon: '🐦' },
//     { name: 'Instagram', icon: '📷' },
//     { name: 'Netflix', icon: '🎬' },
//     { name: 'Amazon', icon: '📦' },
//     { name: 'Microsoft', icon: '🪟' },
//     { name: 'Apple', icon: '🍎' }
//   ];

//   const generatePassword = () => {
//     const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
//     const numberChars = '0123456789';
//     const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

//     let availableChars = '';
//     let guaranteedChars = '';

//     if (criteria.uppercase) {
//       availableChars += uppercaseChars;
//       guaranteedChars += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
//     }
//     if (criteria.lowercase) {
//       availableChars += lowercaseChars;
//       guaranteedChars += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
//     }
//     if (criteria.numbers) {
//       availableChars += numberChars;
//       guaranteedChars += numberChars[Math.floor(Math.random() * numberChars.length)];
//     }
//     if (criteria.special) {
//       availableChars += specialChars;
//       guaranteedChars += specialChars[Math.floor(Math.random() * specialChars.length)];
//     }

//     let newPassword = guaranteedChars;
//     const remainingLength = criteria.length - guaranteedChars.length;

//     for (let i = 0; i < remainingLength; i++) {
//       newPassword += availableChars[Math.floor(Math.random() * availableChars.length)];
//     }

//     // Shuffle the password to avoid predictable patterns
//     const passwordArray = newPassword.split('');
//     for (let i = passwordArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
//     }

//     setPassword(passwordArray.join(''));
//     setShowManualEntry(false);
//   };

//   const savePassword = () => {
//     const passwordToSave = showManualEntry ? manualPassword : password;
    
//     if (!passwordToSave.trim()) {
//       alert('Please generate or enter a password first!');
//       return;
//     }

//     const accountName = selectedAccount === 'custom' ? customAccount : selectedAccount;
    
//     if (!accountName) {
//       alert('Please select an account or enter a custom account name!');
//       return;
//     }

//     // Check if password for this account already exists
//     const existingIndex = savedPasswords.findIndex(entry => entry.account.toLowerCase() === accountName.toLowerCase());
    
//     if (existingIndex !== -1) {
//       const confirmUpdate = window.confirm(`A password for ${accountName} already exists. Do you want to update it?`);
//       if (!confirmUpdate) return;
      
//       // Update existing password
//       const updatedPasswords = [...savedPasswords];
//       updatedPasswords[existingIndex] = {
//         ...updatedPasswords[existingIndex],
//         password: passwordToSave,
//         timestamp: new Date().toLocaleString(),
//         updated: true
//       };
//       setSavedPasswords(updatedPasswords);
//     } else {
//       // Add new password
//       const passwordEntry = {
//         id: Date.now(),
//         account: accountName,
//         password: passwordToSave,
//         timestamp: new Date().toLocaleString(),
//         icon: predefinedAccounts.find(acc => acc.name === accountName)?.icon || '🔐'
//       };
//       setSavedPasswords([...savedPasswords, passwordEntry]);
//     }

//     setShowSaveSuccess(true);
//     setShowAccountForm(false);
//     setSelectedAccount('');
//     setCustomAccount('');
//     setManualPassword('');
//     setTimeout(() => setShowSaveSuccess(false), 3000);
//   };

//   const copyToClipboard = (textToCopy) => {
//     navigator.clipboard.writeText(textToCopy);
//     alert('Password copied to clipboard!');
//   };

//   const deletePassword = (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this password?');
//     if (confirmDelete) {
//       setSavedPasswords(savedPasswords.filter(entry => entry.id !== id));
//     }
//   };

//   const handleCriteriaChange = (criterion) => {
//     setCriteria(prev => ({
//       ...prev,
//       [criterion]: !prev[criterion]
//     }));
//   };

//   const getPasswordStrength = () => {
//     let strength = 0;
//     if (criteria.uppercase) strength++;
//     if (criteria.lowercase) strength++;
//     if (criteria.numbers) strength++;
//     if (criteria.special) strength++;
    
//     if (criteria.length >= 16) strength++;
//     if (criteria.length >= 20) strength++;

//     if (strength <= 2) return { level: 'Weak', color: '#ff4444' };
//     if (strength <= 4) return { level: 'Medium', color: '#ffaa00' };
//     return { level: 'Strong', color: '#44ff44' };
//   };

//   const strength = getPasswordStrength();

//   return (
//     <div className="auth-container">
//       <div className="homepage-container">
//         <div className="homepage-header">
//           <h1>🔐 Password Manager</h1>
//           <p>Generate secure passwords and manage your accounts</p>
//         </div>

//         <div className="homepage-content">
//           {/* Password Generator Section */}
//           <div className="section-card">
//             <h2>🎲 Generate Password</h2>
            
//             <div className="password-criteria">
//               <h3>Password Criteria</h3>
//               <div className="criteria-grid">
//                 <label className="criteria-item">
//                   <input
//                     type="checkbox"
//                     checked={criteria.uppercase}
//                     onChange={() => handleCriteriaChange('uppercase')}
//                   />
//                   <span>Uppercase Letters (A-Z)</span>
//                 </label>
                
//                 <label className="criteria-item">
//                   <input
//                     type="checkbox"
//                     checked={criteria.lowercase}
//                     onChange={() => handleCriteriaChange('lowercase')}
//                   />
//                   <span>Lowercase Letters (a-z)</span>
//                 </label>
                
//                 <label className="criteria-item">
//                   <input
//                     type="checkbox"
//                     checked={criteria.numbers}
//                     onChange={() => handleCriteriaChange('numbers')}
//                   />
//                   <span>Numbers (0-9)</span>
//                 </label>
                
//                 <label className="criteria-item">
//                   <input
//                     type="checkbox"
//                     checked={criteria.special}
//                     onChange={() => handleCriteriaChange('special')}
//                   />
//                   <span>Special Characters (!@#$%)</span>
//                 </label>
//               </div>
              
//               <div className="length-selector">
//                 <label>
//                   Password Length: 
//                   <input
//                     type="range"
//                     min="8"
//                     max="32"
//                     value={criteria.length}
//                     onChange={(e) => setCriteria(prev => ({...prev, length: parseInt(e.target.value)}))}
//                     className="length-slider"
//                   />
//                   <span className="length-value">{criteria.length}</span>
//                 </label>
//               </div>

//               <div className="strength-indicator">
//                 <span>Strength: </span>
//                 <span style={{ color: strength.color, fontWeight: 'bold' }}>
//                   {strength.level}
//                 </span>
//               </div>
//             </div>

//             <button 
//               className="generate-btn"
//               onClick={generatePassword}
//               disabled={!criteria.uppercase && !criteria.lowercase && !criteria.numbers && !criteria.special}
//             >
//               🎲 Generate Password
//             </button>

//             <div className="password-display">
//               <textarea
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Generated password will appear here..."
//                 className="password-textarea"
//                 rows="3"
//               />
//               {password && (
//                 <button className="copy-btn" onClick={() => copyToClipboard(password)}>
//                   📋 Copy
//                 </button>
//               )}
//             </div>

//             <div className="manual-entry-section">
//               <button 
//                 className="manual-entry-btn"
//                 onClick={() => setShowManualEntry(!showManualEntry)}
//               >
//                 ✏️ {showManualEntry ? 'Hide Manual Entry' : 'Add Password Manually'}
//               </button>
              
//               {showManualEntry && (
//                 <div className="manual-entry-form">
//                   <textarea
//                     value={manualPassword}
//                     onChange={(e) => setManualPassword(e.target.value)}
//                     placeholder="Enter your password manually..."
//                     className="password-textarea"
//                     rows="3"
//                   />
//                   {manualPassword && (
//                     <button className="copy-btn" onClick={() => copyToClipboard(manualPassword)}>
//                       📋 Copy
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Save Password Section */}
//           <div className="section-card">
//             <h2>💾 Save Password</h2>
            
//             {!showAccountForm ? (
//               <button 
//                 className="save-btn"
//                 onClick={() => setShowAccountForm(true)}
//                 disabled={!password.trim() && !manualPassword.trim()}
//               >
//                 💾 Save Password for Account
//               </button>
//             ) : (
//               <div className="account-selection">
//                 <h4>Select Account</h4>
//                 <div className="account-grid">
//                   {predefinedAccounts.map((account) => (
//                     <button
//                       key={account.name}
//                       className={`account-btn ${selectedAccount === account.name ? 'selected' : ''}`}
//                       onClick={() => setSelectedAccount(account.name)}
//                     >
//                       <span className="account-icon">{account.icon}</span>
//                       <span className="account-name">{account.name}</span>
//                     </button>
//                   ))}
//                   <button
//                     className={`account-btn custom-btn ${selectedAccount === 'custom' ? 'selected' : ''}`}
//                     onClick={() => setSelectedAccount('custom')}
//                   >
//                     <span className="account-icon">➕</span>
//                     <span className="account-name">Custom</span>
//                   </button>
//                 </div>

//                 {selectedAccount === 'custom' && (
//                   <input
//                     type="text"
//                     value={customAccount}
//                     onChange={(e) => setCustomAccount(e.target.value)}
//                     placeholder="Enter custom account name..."
//                     className="custom-account-input"
//                   />
//                 )}

//                 <div className="account-actions">
//                   <button className="save-final-btn" onClick={savePassword}>
//                     💾 Save Password
//                   </button>
//                   <button className="cancel-btn" onClick={() => setShowAccountForm(false)}>
//                     ❌ Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {showSaveSuccess && (
//               <div className="success-message">
//                 ✅ Password saved successfully!
//               </div>
//             )}
//           </div>

//           {/* Saved Passwords Section */}
//           <div className="section-card">
//             <div className="saved-passwords-header">
//               <h2>📋 Saved Passwords ({savedPasswords.length})</h2>
//               {savedPasswords.length > 0 && (
//                 <button 
//                   className="toggle-saved-btn"
//                   onClick={() => setShowSavedPasswords(!showSavedPasswords)}
//                 >
//                   {showSavedPasswords ? '🙈 Hide' : '👁️ Show'} Saved Passwords
//                 </button>
//               )}
//             </div>

//             {showSavedPasswords && savedPasswords.length > 0 && (
//               <div className="saved-list">
//                 {savedPasswords.map((entry) => (
//                   <div key={entry.id} className="saved-item">
//                     <div className="saved-account">
//                       <span className="saved-icon">{entry.icon}</span>
//                       <span className="saved-account-name">{entry.account}</span>
//                     </div>
//                     <div className="saved-password-section">
//                       <span className="saved-password">{'•'.repeat(entry.password.length)}</span>
//                       <button 
//                         className="copy-saved-btn"
//                         onClick={() => copyToClipboard(entry.password)}
//                         title="Copy password"
//                       >
//                         📋
//                       </button>
//                       <button 
//                         className="delete-btn"
//                         onClick={() => deletePassword(entry.id)}
//                         title="Delete password"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                     <div className="saved-time">
//                       {entry.updated ? 'Updated: ' : 'Created: '}{entry.timestamp}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {savedPasswords.length === 0 && (
//               <div className="no-passwords">
//                 <p>No passwords saved yet. Generate and save your first password!</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="navigation-links">
//           <Link to="/login">🔑 Login</Link>
//           <Link to="/signup">📝 Sign Up</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homepage;