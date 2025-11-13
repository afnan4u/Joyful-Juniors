import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Palette, Lightbulb, Trophy, RotateCcw, CheckCircle } from 'lucide-react';

const memoryCards = [
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎸',
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎸',
];

const quizQuestions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correct: 1,
  },
  {
    question: 'How many colors are in a rainbow?',
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    question: 'What animal is known as the King of the Jungle?',
    options: ['Tiger', 'Elephant', 'Lion', 'Bear'],
    correct: 2,
  },
];

const coloringTemplates = [
  { id: 1, name: 'Butterfly', paths: 4 },
  { id: 2, name: 'Rainbow', paths: 7 },
  { id: 3, name: 'Sun', paths: 8 },
];

export function Games() {
  const [activeGame, setActiveGame] = useState<'memory' | 'coloring' | 'quiz' | null>(null);

  return (
    <section id="games" className="py-16 md:py-24 bg-gradient-to-br from-primary-light via-white to-secondary-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
            Games & Learning
          </h2>
          <p className="text-lg md:text-xl text-neutral-dark/80 max-w-2xl mx-auto">
            Play interactive games and have fun while learning!
          </p>
        </motion.div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <GameCard
              icon={Brain}
              title="Memory Match"
              description="Test your memory by matching pairs of cards!"
              color="from-accent to-accent-light"
              onClick={() => setActiveGame('memory')}
            />
            <GameCard
              icon={Palette}
              title="Color & Create"
              description="Bring beautiful templates to life with colors!"
              color="from-primary to-primary-light"
              onClick={() => setActiveGame('coloring')}
            />
            <GameCard
              icon={Lightbulb}
              title="Smart Quiz"
              description="Answer fun questions and earn points!"
              color="from-secondary to-secondary-light"
              onClick={() => setActiveGame('quiz')}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <motion.button
              onClick={() => setActiveGame(null)}
              className="mb-6 px-6 py-3 bg-white text-neutral-dark font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Games
            </motion.button>
            {activeGame === 'memory' && <MemoryGame />}
            {activeGame === 'coloring' && <ColoringGame />}
            {activeGame === 'quiz' && <QuizGame />}
          </div>
        )}
      </div>
    </section>
  );
}

function GameCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow text-left focus:outline-none focus:ring-4 focus:ring-primary"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`bg-gradient-to-br ${color} rounded-2xl w-16 h-16 flex items-center justify-center mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-display font-bold text-neutral-dark mb-2">{title}</h3>
      <p className="text-neutral-dark/70">{description}</p>
    </motion.button>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState(() =>
    memoryCards.sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndices([]);

        if (newCards.every((card) => card.matched)) {
          setWon(true);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(
      memoryCards.sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
    );
    setFlippedIndices([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-display font-bold text-neutral-dark">Memory Match</h3>
        <div className="flex items-center space-x-4">
          <span className="text-neutral-dark/70 font-semibold">Moves: {moves}</span>
          <motion.button
            onClick={resetGame}
            className="p-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {won && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-100 border-2 border-green-500 rounded-2xl p-6 mb-6 text-center"
        >
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <p className="text-xl font-display font-bold text-green-700">
            You won in {moves} moves! 🎉
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-2xl text-4xl flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              card.flipped || card.matched
                ? 'bg-gradient-to-br from-primary to-secondary'
                : 'bg-gradient-to-br from-neutral-light to-neutral'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {(card.flipped || card.matched) && card.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ColoringGame() {
  const [selectedTemplate, setSelectedTemplate] = useState(coloringTemplates[0]);
  const [colors, setColors] = useState<string[]>(Array(selectedTemplate.paths).fill('#FFFFFF'));
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  const colorPalette = ['#FF6B6B', '#56CCF2', '#FFD54A', '#A78BFA', '#34D399', '#F472B6', '#FB923C'];

  const handlePathClick = (index: number) => {
    const newColors = [...colors];
    newColors[index] = selectedColor;
    setColors(newColors);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
      <h3 className="text-2xl font-display font-bold text-neutral-dark mb-6">Color & Create</h3>

      <div className="flex gap-4 mb-6 flex-wrap">
        {coloringTemplates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template);
              setColors(Array(template.paths).fill('#FFFFFF'));
            }}
            className={`px-4 py-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              selectedTemplate.id === template.id
                ? 'bg-primary text-neutral-dark'
                : 'bg-neutral-light text-neutral-dark hover:bg-neutral'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {template.name}
          </motion.button>
        ))}
      </div>

      <div className="bg-neutral-light rounded-2xl p-8 mb-6 min-h-[300px] flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: selectedTemplate.paths }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handlePathClick(index)}
              className="w-16 h-16 rounded-xl border-2 border-neutral-dark/20 focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ backgroundColor: colors[index] }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {colorPalette.map((color) => (
          <motion.button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-12 h-12 rounded-full border-4 focus:outline-none ${
              selectedColor === color ? 'border-neutral-dark scale-110' : 'border-white'
            }`}
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>
    </div>
  );
}

function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <Trophy className="w-20 h-20 text-primary mx-auto mb-4" />
          <h3 className="text-3xl font-display font-bold text-neutral-dark mb-2">Quiz Complete!</h3>
          <p className="text-xl text-neutral-dark/80 mb-6">
            You scored {score} out of {quizQuestions.length}
          </p>
          <motion.button
            onClick={resetQuiz}
            className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-display font-bold text-neutral-dark">Smart Quiz</h3>
        <span className="text-neutral-dark/70 font-semibold">
          Question {currentQuestion + 1}/{quizQuestions.length}
        </span>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full mb-4">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        <h4 className="text-xl font-semibold text-neutral-dark mb-6">
          {quizQuestions[currentQuestion].question}
        </h4>

        <div className="space-y-3">
          {quizQuestions[currentQuestion].options.map((option, index) => {
            const isCorrect = index === quizQuestions[currentQuestion].correct;
            const isSelected = index === selectedAnswer;

            return (
              <motion.button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl font-semibold text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-100 border-2 border-green-500'
                      : isSelected
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-neutral-light'
                    : 'bg-neutral-light hover:bg-neutral'
                }`}
                whileHover={!showResult ? { scale: 1.02, x: 4 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-neutral-dark/70 font-semibold">Score: {score}</div>
    </div>
  );
}
