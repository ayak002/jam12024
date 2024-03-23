import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css'; // Import CSS file if needed
//import oiseauFlag from './albanie.png';
//import australieFlag from './australie.png';


function CreateGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Create New Game page */}
      <h1>Create une nouvelle partie</h1>
    </div>
  );
}

function JoinGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Join a Game page */}
      <h1>Joindre une partie</h1>
    </div>
  );
}

function App() {
  const [menuVisible, setMenuVisible] = useState(true);
  const [username, setUsername] = useState('');


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Save the username when ENTER key is pressed
      const enteredUsername = event.target.value.trim();
      setUsername(enteredUsername); // Save the username
      setMenuVisible(true); // Hide the menu
      event.target.value = ''; // Clear the input field
    }
  };

  // Function to import all flag images from a directory
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

// Import all flag images dynamically
const flagImages = importAll(require.context('./flags/', false, /\.(png)$/));

// Generate React components for each flag image
const FlagComponents = Object.keys(flagImages).map((imageName, index) => {
  return (
    <img key={index} src={flagImages[imageName]} alt={imageName} />
  );
});

  return (
    <Router>
      <div className="App">
        {/* Flags container */}
        <div className="flag-container">
          {/* Flags */}
            {FlagComponents}
        </div>

        <Switch>
          <Route exact path="/">
            {menuVisible ? (
              <div className="menu">
                <h1>Devine où !</h1>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyDown={handleKeyDown} // Listen for ENTER key
                  placeholder="Enter your username"
                />
                <Link to="/create-game" className="menu-link">
                  <button>Créer une nouvelle partie</button>
                </Link>
                <Link to="/join-game" className="menu-link">
                  <button>Joindre une partie</button>
                </Link>
                {username && <p className="username">{username}</p>}
              </div>
            ) : (
              // Render your game components here when the menu is not visible
              <div>
                <h1>Game Started!</h1>
                {/* Add your game components here */}
              </div>
            )}
          </Route>
          <Route path="/create-game" component={CreateGamePage} />
          <Route path="/join-game" component={JoinGamePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
