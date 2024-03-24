import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css'; // Import CSS file if needed

function GetList() {
  const [dataArray, setDataArray] = useState([]);
  const [flagImages, setFlagImages] = useState({});

  useEffect(() => {
    // Fetch JSON data from the server
    fetch('http://localhost:8080/randomList')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Convert JSON data to array
        const array = Array.isArray(data) ? data : []; // Check if data is an array
        setDataArray(array);
        console.log("json=", array);
        // Import all flag images dynamically
        const importedFlagImages = importAll(require.context('./flags/', false, /\.(png)$/));
        setFlagImages(importedFlagImages);
        console.log("import=",importedFlagImages)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  // Function to import all flag images from a directory
  function importAll(r) {
    let images = {};
    r.keys().forEach(key => {
      images[key.replace('./', '')] = r(key);
    });
    return images;
  }

  // Function to get the filename from the path
  function getFilename(path) {
    return path.split('/').pop();
  }

  return (
    <div className="flag-game">
      {/* Render your component using the dataArray */}
      {dataArray.map((item, index) => {
        if (Array.isArray(item) && item.length >= 2) {
          const imageName = item[1]; // Extract the path to the image
          const filename = getFilename(imageName); // Extract the filename
          return <img className='flag' key={index} src={flagImages[filename]} alt={filename} />;
        } else {
          return null;
        }
      })}
    </div>
  );
}




function CreateGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Create New Game page */}
      <h1>Créer une nouvelle partie</h1>
      <GetList />
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

  console.log("Flag images:", flagImages);

  // Generate React components for each flag image
  const FlagComponents = Object.keys(flagImages).map((imageName, index) => {
    // Ensure that the callback function returns a value
    console.log("Image name:", imageName);
    console.log("Image source:", flagImages[imageName]);

    return (
      <img className='flag' key={index} src={flagImages[imageName]} alt={imageName} />
    );
  });

  console.log("Flag components:", FlagComponents);

  function displayFlags() {
    return (
      <div className="flag-container">
        {FlagComponents}
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {menuVisible ? (
            <div className="menu">
              <h1>Devine où !</h1>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={handleKeyDown}
                placeholder="Écrit ton pseudo !"
              />
              <Link to="/create-game" className="menu-link">
                <button>Créer une nouvelle partie</button>
              </Link>
              <Link to="/join-game" className="menu-link">
                <button>Joindre une partie</button>
              </Link>
              {username && <p className="username">{username}</p>}
              {displayFlags()}
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
    </Router>
  );
}

export default App;
