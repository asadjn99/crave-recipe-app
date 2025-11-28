
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Heart, ChefHat, Youtube, X, Utensils, ArrowRight, 
  Phone, Linkedin, Copyright as CopyrightIcon, Share2, Play, 
  Timer as TimerIcon, MessageSquare, ChevronLeft, ChevronRight, Zap,
  Flame, Leaf, Droplet, Dice5
} from 'lucide-react';

// --- Constants ---
const CATEGORIES = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 'Seafood', 
  'Side', 'Starter', 'Vegan', 'Vegetarian', 'Breakfast', 'Goat'
];

// --- Sub-Components ---

// 1. Loading Skeleton
const RecipeSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-5 space-y-3">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
);

// 2. Nutrition Card
const NutritionCard = ({ icon: Icon, label, value, color }) => (
  <div className={`flex flex-col items-center p-3 rounded-xl border ${color} bg-white shadow-sm`}>
    <Icon className={`w-5 h-5 mb-1 ${color.replace('border', 'text').replace('200', '500')}`} />
    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-lg font-bold text-slate-900">{value}</span>
  </div>
);

// 3. AI Assistant Modal
const AiAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m Chef Bot. Ask me about substitutions, cooking times, or recipe tips!' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply = "I'm still learning! Could you ask that differently?";
      const lower = input.toLowerCase();
      
      if (lower.match(/hi|hello|hey/)) reply = "Hello chef! What are we cooking today?";
      else if (lower.includes('thank')) reply = "You're welcome! Happy cooking! 🍳";
      else if (lower.includes('egg')) reply = "Baking? Try 1/4 cup applesauce or 1 mashed banana per egg.";
      else if (lower.includes('milk')) reply = "Almond, soy, oat, or coconut milk work great.";
      else if (lower.includes('butter')) reply = "You can use oil (coconut/vegetable) or applesauce in baking.";
      else if (lower.includes('sugar')) reply = "Honey or maple syrup are great substitutes.";
      else if (lower.includes('salt')) reply = "Too salty? Add a splash of acid (lemon/vinegar) or a pinch of sugar.";
      else if (lower.includes('spicy')) reply = "Too spicy? Add dairy (yogurt, milk) or nut butter to cool it down.";
      else if (lower.includes('vegetarian')) reply = "Swap meat for lentils, chickpeas, mushrooms, or tofu.";
      else if (lower.includes('time')) reply = "Chicken takes 20-30 mins. Pasta is usually 8-12 mins boiling.";
      
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in h-[500px] max-h-[80vh]">
      <div className="bg-orange-500 p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg"><MessageSquare className="w-4 h-4" /></div>
          <span className="font-bold">Chef Bot</span>
        </div>
        <button onClick={onClose}><X className="w-5 h-5 opacity-80 hover:opacity-100" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800"
        />
        <button type="submit" className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// 4. Cook Mode (Immersive View)
const CookMode = ({ recipe, onClose, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false); // Timer finished
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setTimerActive(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 text-white flex flex-col animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-orange-400">Cook Mode</h2>
          <p className="text-slate-400 text-sm line-clamp-1">{recipe.strMeal}</p>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-3xl mx-auto overflow-y-auto">
        {steps.length > 0 ? (
          <>
            <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">
              Step {currentStep + 1} of {steps.length}
            </span>
            <p className="text-2xl md:text-2xl font-medium  md:leading-small">
              {steps[currentStep]}
            </p>
          </>
        ) : (
          <p className="text-xl text-slate-400">No step-by-step instructions available for this recipe.</p>
        )}
        
        <div className="mt-10 flex gap-4">
          {timeLeft > 0 ? (
            <div className="flex items-center gap-3 bg-orange-500/20 text-orange-400 px-6 py-3 rounded-full border border-orange-500/50">
              <TimerIcon className="w-6 h-6 animate-pulse" />
              <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
              <button onClick={() => setTimeLeft(0)} className="ml-2 hover:text-white"><X className="w-4 h-4"/></button>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={() => startTimer(5)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <TimerIcon className="w-4 h-4" /> 5m
              </button>
              <button onClick={() => startTimer(10)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                <TimerIcon className="w-4 h-4" /> 10m
              </button>
            </div>
          )}
        </div>
      </div>

      {steps.length > 0 && (
        <div className="p-6 pb-10 flex justify-between items-center max-w-5xl mx-auto w-full shrink-0">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition text-lg font-medium"
          >
            <ChevronLeft className="w-6 h-6" /> Prev
          </button>
          <div className="flex gap-1.5 hidden sm:flex">
            {steps.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'bg-orange-500 w-6' : 'bg-slate-700'}`} />
            ))}
          </div>
          <button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-orange-600 disabled:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-500 transition text-lg font-bold"
          >
            Next <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

// 5. Recipe Modal (The Detail View)
const RecipeModal = ({ recipe, onClose, onFavorite, isFavorite, onShare, onStartCook }) => {
  if (!recipe) return null;

  const getIngredients = (meal) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push({
          item: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`]
        });
      }
    }
    return ingredients;
  };

  const getNutrition = (id) => {
    const seed = parseInt(id) || 50000;
    return {
      calories: Math.floor((seed % 500) + 200),
      protein: Math.floor((seed % 40) + 10) + 'g',
      carbs: Math.floor((seed % 60) + 20) + 'g',
      fats: Math.floor((seed % 30) + 5) + 'g'
    };
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const nut = getNutrition(recipe.idMeal);
  const ingredients = getIngredients(recipe);
  const instructions = (recipe.strInstructions || '').split(/\r\n|\n/).filter(i => i.trim().length > 2);
  const difficulty = ingredients.length <= 8 ? 'Easy' : (ingredients.length <= 12 ? 'Medium' : 'Hard');
  const difficultyColor = difficulty === 'Easy' ? 'text-green-600 bg-green-100' : (difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100');
  const DifficultyIcon = difficulty === 'Easy' ? Zap : (difficulty === 'Medium' ? ChefHat : Flame);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-56 sm:h-72 shrink-0 group">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-md shadow-sm">
                    {recipe.strCategory}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 ${difficultyColor} text-xs font-bold rounded-md shadow-sm`}>
                    <DifficultyIcon className="w-3 h-3" /> {difficulty}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-2">{recipe.strMeal}</h2>
                <div className="flex items-center gap-4 text-slate-200 text-sm">
                  <span className="flex items-center gap-1"><Utensils className="w-4 h-4"/> {recipe.strArea}</span>
                  <span className="hidden sm:flex items-center gap-1"><TimerIcon className="w-4 h-4"/> ~30 mins</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => onShare(recipe)} className="p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white hover:text-slate-900 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => onFavorite(recipe)} className="p-3 bg-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform">
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500 animate-[pulse_0.5s_ease-in-out]' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
             <button onClick={onStartCook} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-[1.02] transition-all">
              <Play className="w-5 h-5 fill-current" /> Start Cook Mode
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
            <NutritionCard icon={Flame} label="Calories" value={nut.calories} color="border-orange-200 text-orange-500" />
            <NutritionCard icon={Zap} label="Protein" value={nut.protein} color="border-blue-200 text-blue-500" />
            <NutritionCard icon={Leaf} label="Carbs" value={nut.carbs} color="border-green-200 text-green-500" />
            <NutritionCard icon={Droplet} label="Fats" value={nut.fats} color="border-yellow-200 text-yellow-500" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div> Ingredients
                </h3>
                <ul className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 group-hover:bg-orange-400 transition-colors"></div>
                      <span className="font-medium text-slate-700">{ing.measure}</span>
                      <span className="text-slate-500">{ing.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div> Instructions
                </h3>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  {instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 font-bold rounded-full text-sm">{idx + 1}</span>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              {recipe.strYoutube && getYoutubeId(recipe.strYoutube) && (
                <div className="pt-6 border-t border-slate-100">
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Youtube className="w-6 h-6 text-red-600" /> Video Tutorial
                  </h3>
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(recipe.strYoutube)}`}
                      title="Recipe Video"
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home');
  const [cookMode, setCookMode] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchRecipes = async (searchTerm = '') => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`;
      
      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  const fetchByCategory = async (cat) => {
    setSelectedCategory(cat);
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
    const saved = localStorage.getItem('craveFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory(null);
    fetchRecipes(query);
  };

  const toggleFavorite = (recipe) => {
    let updatedFavorites;
    const exists = favorites.find(f => f.idMeal === recipe.idMeal);
    if (exists) {
      updatedFavorites = favorites.filter(f => f.idMeal !== recipe.idMeal);
    } else {
      updatedFavorites = [...favorites, recipe];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('craveFavorites', JSON.stringify(updatedFavorites));
  };

  const shareRecipe = async (recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.strMeal,
          text: `Check out this recipe for ${recipe.strMeal} on Crave!`,
          url: window.location.href,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getCleanSteps = (instructions) => {
    return instructions
      ? instructions.split(/\r\n|\n/).filter(s => s.trim().length > 2)
      : [];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-100 flex flex-col overflow-y-scroll">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div onClick={() => {setView('home'); fetchRecipes(); setSelectedCategory(null);}} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Crave<span className="text-orange-500">.</span><span className='text-orange-500 text-xs'> BY ASAD JN</span> </span>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
              <input
                type="text"
                placeholder="Find a recipe..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-orange-500 rounded-full outline-none transition-all shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </form>

            <button onClick={() => setView('favorites')} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-black-500 border border-slate-200 bg-transparent hover:bg-transparent hover:text-orange-500 hover:border-orange-500 ${view === 'favorites' ? 'bg-orange-50 text-orange-600 font-medium border-orange-100' : ''}`}>
              <Heart className={`w-5 h-5 ${view === 'favorites' ? 'fill-white-500 text-orange-500' : ''}`} />
              <span className="hidden sm:inline">Favorites ({favorites.length})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <form onSubmit={handleSearch} className="md:hidden mb-6 relative">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:border-orange-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
        </form>

        {view === 'home' && (
          <div className="mb-8 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => fetchByCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {view === 'favorites' ? 'Your Cookbook' : (selectedCategory ? `${selectedCategory} Recipes` : (query ? `Results for "${query}"` : 'Discover & Cook'))}
            </h1>
            <p className="text-slate-500 mt-1">
              {view === 'favorites' ? 'All your saved recipes in one place.' : 'Explore delicious recipes from around the world.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => <RecipeSkeleton key={i} />)
          ) : (view === 'favorites' ? favorites : recipes).length > 0 ? (
            (view === 'favorites' ? favorites : recipes).map((meal) => (
              <div 
                key={meal.idMeal} 
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedRecipe(meal)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(meal); }} className="p-2 bg-white/90 backdrop-blur rounded-full text-slate-700 hover:text-red-500 shadow-sm">
                      <Heart className={`w-4 h-4 ${favorites.some(f => f.idMeal === meal.idMeal) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-slate-700 shadow-sm">{meal.strCategory}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2 pr-2 mb-1">{meal.strMeal}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1"><Utensils className="w-3 h-3" /> {meal.strArea}</div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-slate-50 text-slate-600 font-medium text-sm rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                    View Recipe <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4"><Utensils className="w-8 h-8 text-slate-400" /></div>
              <h3 className="text-lg font-medium text-slate-900">No recipes found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your search or category filter.</p>
              {selectedCategory && (
                <button onClick={() => {setSelectedCategory(null); fetchRecipes();}} className="mt-4 text-orange-600 font-medium hover:underline">Clear Filters</button>
              )}
            </div>
          )}
        </div>
      </main>

      <button onClick={() => setAiOpen(!aiOpen)} className="fixed bottom-6 right-6 z-40 p-4 bg-orange-500 text-white rounded-full shadow-xl hover:bg-orange-600 hover:scale-105 transition-all">
        {aiOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      <AiAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1"><CopyrightIcon className="w-4 h-4" /> <span>{new Date().getFullYear()} asadjn99. All rights reserved.</span></div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <a href="tel:+923075993029" className="flex items-center gap-2 hover:text-orange-500 transition-colors"><Phone className="w-4 h-4" /> <span>Help Contact: +92 307 5993029</span></a>
              <a href="https://linkedin.com/in/asad-jn99" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-500 transition-colors"><Linkedin className="w-4 h-4" /> <span>linkedin.com/in/asad-jn99</span></a>
            </div>
          </div>
        </div>
      </footer>

      {cookMode && selectedRecipe && (
        <CookMode 
          recipe={selectedRecipe} 
          steps={getCleanSteps(selectedRecipe.strInstructions)}
          onClose={() => setCookMode(false)}
        />
      )}

      {!cookMode && selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onFavorite={toggleFavorite}
          isFavorite={favorites.some(f => f.idMeal === selectedRecipe.idMeal)}
          onShare={shareRecipe}
          onStartCook={() => setCookMode(true)}
        />
      )}
    </div>
  );
}