import React, { useState } from 'react';
import './App.css'; // Import CSS file if needed

function App() {
  const [menuVisible, setMenuVisible] = useState(true);

  const handleStartButtonClick = () => {
    // Handle start button click event here
    console.log("Game started!");
    // You can add additional logic here to start the game
  };

  return (
    <div className="App">
      {menuVisible ? (
        <div className="menu">
          <h1>Game Menu</h1>
          <button onClick={handleStartButtonClick}>Create new game</button>
          <button onClick={handleStartButtonClick}>Join a game</button>
        </div>
      ) : (
        // Render your game components here when the menu is not visible
        <div>
          <h1>Game Started!</h1>
          {/* Add your game components here */}
        </div>
      )}
    </div>
  );
}

export default App;
