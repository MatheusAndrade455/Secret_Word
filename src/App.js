//css
import './App.css';

//react
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from './data/words';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(5);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {
    //pega a categoria
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    
    //pega uma palavra
    const word = words[category][Math.floor(Math.random() * words[category].length)];
   
    return {category, word};
  }, [words]);

  //starta o jogo
  const startGame = useCallback(() => {
    clearLetterStates();

    //escolhe a palavra e a categoria
    const { category, word } = pickWordAndCategory();
    
    //faz um array com as letras da palavra
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    //console.log(category, word);

    //preenche os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //processo de insercao de letra
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //verifica se a letra ja foi usada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter))
    {
      return;
    }
    
    //coloca a palavra chutada ou tira a chance
      if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }; 
  
  //reseta as letras
  const clearLetterStates = () => {
     setGuessedLetters([]);
     setWrongLetters([]);
  };

  //finaliza o jogo se as chances acabarem
  useEffect(() => {
     if(guesses <= 0){
      clearLetterStates()   
      setGameStage(stages[2].name)
     }
  }, [guesses]);

  //finaliza o jogo se acertar a palavra
  useEffect(() => {
    //faz com que uma letra repetida nao precise ser digitada novamente
    const uniqueLetters = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }
  }, [guessedLetters, letters, startGame])

  //restarta o jogo
  const retry = () => {
    setScore(0);
    setGuesses(5);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && (<Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />)}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
