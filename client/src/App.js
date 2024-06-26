import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import croix from './croix.png'
import ChatApp from './chat';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8080");

function Autocomplete({ options, onSelect }) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

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
  const sendMessage = () => {
  if (inputValue.trim() !== '') {
    socket.emit('answer', inputValue);
    setInputValue('');
    }
  }

  return (
    <div className="autocomplete" style={{ display: 'inline-block' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
        style={{ padding: '4px', fontSize: '12  px', width: '120px', borderRadius: '4px', border: 'none', marginBottom: '4px' }}
      />
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {filteredOptions.map((option, index) => (
          <li key={index} onClick={() => handleSelectOption(option)} style={{ padding: '2px 8px', cursor: 'pointer', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd',fontSize: '10px' }}>
            {option}
          </li>
        ))}
      </ul>
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
}

function GetList(roomId) {
  const [dataArray, setDataArray] = useState([]);
  const [flagImages, setFlagImages] = useState({});
  const [clickedFlags, setClickedFlags] = useState([]);
  const [hoveredFlagIndex, setHoveredFlagIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/randomList')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const array = Array.isArray(data) ? data : [];
        setDataArray(array);
        const importedFlagImages = importAll2(require.context('./flags/', false, /\.(png)$/));
        setFlagImages(importedFlagImages);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  function importAll2(r) {
    let images = {};
    r.keys().forEach(key => {
      images[key.replace('./', '')] = r(key);
    });
    return images;
  }

  function getFilename(path) {
    return path.split('/').pop();
  }

  const handleFlagClick = (index) => {
    if (clickedFlags.includes(index)) {
      setClickedFlags(clickedFlags.filter(flagIndex => flagIndex !== index));
    } else {
      setClickedFlags([...clickedFlags, index]);
    }
  };

  const handleFlagHover = (index) => {
    setHoveredFlagIndex(index);
  };

  const handleFlagLeave = () => {
    setHoveredFlagIndex(-1);
  };

  function chunkArray(arr, size) {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  }

  const chunkedFlags = chunkArray(dataArray, 10);

  return (
    <div className="flag-container">
      <div>
      <ChatApp socket={socket} />
      </div>
      <div>
        <p>Ton pays</p>
        <Autocomplete
          options={dataArray.map(item => item[0])}
          onSelect={(option) => {
            setSelectedOption(option);
            // console.log("Element sélectionné:", option);
          }}
        />
      </div>
      <table>
        <tbody>
          {chunkedFlags.slice(0, 3).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((item, colIndex) => {
                const index = rowIndex * 10 + colIndex;
                const countryName = item[0];
                const imageName = item[1];
                const filename = getFilename(imageName);
                const isClicked = clickedFlags.includes(index);
                return (
                  <td key={colIndex}>
                    <div
                      className={`flag-item ${hoveredFlagIndex === index || clickedFlags.includes(index) ? 'selected' : ''}`}
                      onClick={() => handleFlagClick(index)}
                      onMouseEnter={() => handleFlagHover(index)}
                      onMouseLeave={handleFlagLeave}
                    >
                      <img className='flag' src={flagImages[filename]} alt={filename} />
                      <p className="country-name">{countryName}</p>
                      {clickedFlags.includes(index) && <img className='cross' src={croix} alt="cross" />}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <p>Réponse</p>
        <Autocomplete
          options={dataArray.map(item => item[0])}
          onSelect={(option) => {
            setSelectedOption(option);
            // console.log("Element sélectionné 2:", option);
          }}
        />
      </div>
    </div>
  );
}

function CreateGamePage() {
  return (
    <div className="white-page">
      <GetList roomId={0}/>
    </div>
  );
}

function JoinGamePage() {
  return (
    <div className="white-page">
      <GetList />
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
      const enteredUsername = event.target.value.trim();
      setUsername(enteredUsername);
      setMenuVisible(true);
      event.target.value = '';
    }
  };
  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  const flagImages = importAll(require.context('./flags/', false, /\.(png)$/));

  console.log("Flag images:", flagImages);
  const FlagComponents = Object.keys(flagImages).map((imageName, index) => {
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
            <div>
              <h1>Game Started!</h1>
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
