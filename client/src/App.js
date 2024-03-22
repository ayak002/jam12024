import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css'; // Import CSS file if needed

function CreateGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Create New Game page */}
      <h1>Create New Game Page</h1>
    </div>
  );
}

function JoinGamePage() {
  return (
    <div className="white-page">
      {/* Content for the Join a Game page */}
      <h1>Join a Game Page</h1>
    </div>
  );
}

function App() {
  const [menuVisible, setMenuVisible] = useState(true);

  const handleStartButtonClick = () => {
    // Handle start button click event here
    console.log("Game started!");
    // You can add additional logic here to start the game
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            {menuVisible ? (
              <div className="menu">
                <h1>Devine où !</h1>
                <Link to="/create-game" className="menu-link">
                  <button>Create new game</button>
                </Link>
                <Link to="/join-game" className="menu-link">
                  <button>Join a game</button>
                </Link>
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
