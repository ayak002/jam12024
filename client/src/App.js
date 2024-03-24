import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css'; // Import CSS file if needed

function Autocomplete({ options, onSelect }) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter options based on input value
    const filtered = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelectOption = (option) => {
    setInputValue(option);
    onSelect(option);
    setFilteredOptions([]);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <ul>
        {filteredOptions.map((option, index) => (
          <li key={index} onClick={() => handleSelectOption(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
        // Import all flag images dynamically
        const importedFlagImages = importAll2(require.context('./flags/', false, /\.(png)$/));
        setFlagImages(importedFlagImages);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  // Function to import all flag images from a directory
  function importAll2(r) {
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

  // Function to chunk the dataArray into arrays of size 10
  function chunkArray(arr, size) {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  }

  // Chunk the dataArray into arrays of size 10
  const chunkedFlags = chunkArray(dataArray, 10);

  return (
    <div className="flag-container">
      <table>
        <tbody>
          {/* Render your component using the dataArray */}
          {chunkedFlags.slice(0, 3).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((item, index) => {
                const countryName = item[0]; // Extract the country name
                const imageName = item[1]; // Extract the path to the image
                const filename = getFilename(imageName); // Extract the filename
                return (
                  <td key={index}>
                    <div className="flag-item">
                      <img className='flag' src={flagImages[filename]} alt={filename} />
                      <p className="country-name">{countryName}</p>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Autocomplete
        options={dataArray.map(item => item[0])}
     //   onSelect={onSelect}
      />
    </div>
  );
}

function CreateGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Create New Game page */}
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
