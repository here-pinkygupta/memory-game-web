import React, { useState, useEffect } from 'react';

function Memory() {
  const [boxSize, setBoxSize] = useState(5);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [back, setBack] = useState(false);
  const [won, setWon] = useState(false);

  const handleBoxSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setBoxSize(size);
  };

  const initializeGame = () => {
    const totalCards = boxSize * boxSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [boxSize]);

  const checkPair = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setBack(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setBack(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (back || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setBack(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkPair(id);
      } else {
        setFlipped([]);
        setBack(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6">Memory Game</h1>
      <div className="mb-4">
        <label htmlFor='box' className="mr-2 text-lg font-semibold">Box Size (Max: 10):</label>
        <input 
          id='box' 
          type="number" 
          min="2" 
          max="10" 
          value={boxSize} 
          onChange={handleBoxSizeChange} 
          className="px-2 py-1 text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid gap-3 p-4 bg-white bg-opacity-10 rounded-lg" 
           style={{ gridTemplateColumns: `repeat(${boxSize}, minmax(0,1fr))`, width: `min(100%, ${boxSize * 5.5}rem)` }}>
        {cards.map((e) => (
          <div
            key={e.id}
            onClick={() => handleClick(e.id)}
            className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300 transform 
            ${isFlipped(e.id) ? (isSolved(e.id) ? "bg-green-500 text-white" : "bg-blue-500 text-white scale-105") : "bg-gray-300 text-gray-400 hover:bg-gray-400 hover:scale-105"}`}
          >
            {isFlipped(e.id) ? e.number : "?"}
          </div>
        ))}
      </div>
      {won && (
        <div className="mt-4 text-4xl font-bold text-green-300 animate-bounce">You Won!</div>
      )}
      <button
        onClick={initializeGame}
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}

export default Memory;
