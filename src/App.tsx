import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

function App() {
  const [time, setTime] = useState(new Date());
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');

  // Curated word collections for poetic phrases
  const nouns = [
    'Midnight', 'Dawn', 'Whisper', 'Shadow', 'Dream', 'Ocean',
    'Storm', 'Ember', 'Memory', 'Star', 'Echo', 'Soul'
  ];

  const verbs = [
    'Dances', 'Whispers', 'Fades', 'Blooms', 'Weeps', 'Soars',
    'Trembles', 'Awakens', 'Wanders', 'Shimmers', 'Breathes', 'Sings'
  ];

  const adverbs = [
    'Softly', 'Wildly', 'Gently', 'Fiercely', 'Silently', 'Boldly',
    'Tenderly', 'Mysteriously', 'Gracefully', 'Suddenly', 'Eternally', 'Sweetly'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isCustomTime) {
      timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCustomTime]);

  // Parse custom time input and generate phrase
  const parseCustomTime = (timeString: string) => {
    if (!timeString) return null;
    
    const [hours, minutes, seconds = '0'] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const second = parseInt(seconds, 10);
    
    if (isNaN(hour) || isNaN(minute) || isNaN(second) ||
        hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
      return null;
    }
    
    return { hour, minute, second };
  };

  const setClockToCustomTime = () => {
    const parsedTime = parseCustomTime(customTime);
    if (!parsedTime) return;
    
    const { hour, minute, second } = parsedTime;
    
    // Create a new date with the specified time
    const newTime = new Date();
    newTime.setHours(hour, minute, second, 0);
    
    setTime(newTime);
    setIsCustomTime(true);
  };

  const resetToRealTime = () => {
    setIsCustomTime(false);
    setTime(new Date());
    setCustomTime('');
  };

  const isValidCustomTime = parseCustomTime(customTime) !== null;

  // Calculate angles for clock hands
  const secondAngle = time.getSeconds() * 6; // 6 degrees per second, starting from 12 o'clock
  const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1; // 6 degrees per minute
  const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5; // 30 degrees per hour

  // Get current words based on hand positions
  const getCurrentNoun = () => {
    const hour = time.getHours() % 12;
    return nouns[hour];
  };

  const getCurrentVerb = () => {
    const minute = Math.floor(time.getMinutes() / 5);
    return verbs[minute];
  };

  const getCurrentAdverb = () => {
    const second = Math.floor(time.getSeconds() / 5);
    return adverbs[second];
  };

  // Generate positions for words around the clock
  const generateWordPositions = (words: string[], type: 'noun' | 'verb' | 'adverb') => {
    return words.map((word, index) => {
      const angle = index * 30; // 30 degrees apart, starting from 12 o'clock
      const radius = type === 'noun' ? 140 : type === 'verb' ? 110 : 80;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      return (
        <div
          key={`${type}-${index}`}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium ${
            type === 'noun' ? 'text-amber-200' : 
            type === 'verb' ? 'text-blue-200' : 
            'text-purple-200'
          }`}
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
          }}
        >
          {word}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-serif text-amber-100 mb-4">
          The Poetic Clock
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Watch as time weaves poetry, with hands that point not to numbers, 
          but to words that dance together in endless, beautiful combinations.
        </p>
      </div>

      {/* Time Input Section */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-purple-300" />
          <h3 className="text-lg font-serif text-purple-200">Explore Any Time</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Set clock to specific time (HH:MM or HH:MM:SS)
            </label>
            <input
              type="text"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="14:30:45"
              className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-amber-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={setClockToCustomTime}
              disabled={!isValidCustomTime}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Set Clock
            </button>
            {isCustomTime && (
              <button
                onClick={resetToRealTime}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Status Display */}
        {isCustomTime && (
          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-400/30 rounded-lg">
            <p className="text-purple-300 text-sm text-center">
              Clock set to: {time.toLocaleTimeString()}
            </p>
          </div>
        )}
        
        {!isValidCustomTime && customTime && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
            <p className="text-red-300 text-sm text-center">
              Please enter a valid time format (HH:MM or HH:MM:SS)
            </p>
          </div>
        )}
      </div>
      {/* Current Phrase Display */}
      <div className="bg-black/20 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-300" />
          <h3 className="text-lg font-serif text-amber-200">{isCustomTime ? 'Set Time' : 'Current Time'}</h3>
        </div>
        <div className="text-2xl md:text-4xl font-serif text-amber-100 leading-relaxed">
          <span className="text-amber-200 font-semibold">{getCurrentNoun()}</span>
          {' '}
          <span className="text-blue-200 font-semibold">{getCurrentVerb()}</span>
          {' '}
          <span className="text-purple-200 font-semibold">{getCurrentAdverb()}</span>
        </div>
        <p className="text-slate-400 mt-4 text-sm">
          Hour: {getCurrentNoun()} • Minute: {getCurrentVerb()} • Second: {getCurrentAdverb()}
        </p>
      </div>

      {/* Clock Face */}
      <div className="relative">
        <div className="w-96 h-96 rounded-full border-2 border-amber-500/30 bg-black/10 backdrop-blur-sm relative shadow-2xl shadow-purple-500/20">
          
          {/* Word positions */}
          {generateWordPositions(nouns, 'noun')}
          {generateWordPositions(verbs, 'verb')}
          {generateWordPositions(adverbs, 'adverb')}

          {/* Clock center */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-amber-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg"></div>

          {/* Hour Hand */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom bg-amber-400 rounded-full shadow-lg transition-transform duration-1000 ease-in-out z-15"
            style={{
              width: '4px',
              height: '80px',
              marginTop: '-80px',
              marginLeft: '-2px',
              transform: `rotate(${hourAngle}deg)`,
            }}
          >
            <div className="w-3 h-3 bg-amber-400 rounded-full absolute -bottom-1.5 -left-0.5"></div>
          </div>

          {/* Minute Hand */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom bg-blue-400 rounded-full shadow-lg transition-transform duration-1000 ease-in-out z-15"
            style={{
              width: '3px',
              height: '110px',
              marginTop: '-110px',
              marginLeft: '-1.5px',
              transform: `rotate(${minuteAngle}deg)`,
            }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full absolute -bottom-1 -left-0.5"></div>
          </div>

          {/* Second Hand */}
          <div
            className="absolute top-1/2 left-1/2 origin-bottom bg-purple-400 rounded-full shadow-lg transition-transform duration-75 ease-out z-15"
            style={{
              width: '2px',
              height: '130px',
              marginTop: '-130px',
              marginLeft: '-1px',
              transform: `rotate(${secondAngle}deg)`,
            }}
          >
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full absolute -bottom-0.5 -left-0.25"></div>
          </div>

          {/* Clock marks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-amber-500/40"
              style={{
                top: '10px',
                left: '50%',
                marginLeft: '-2px',
                transformOrigin: '50% 182px',
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded"></div>
            <span className="text-amber-200">Hour Hand → Nouns</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-blue-200">Minute Hand → Verbs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span className="text-purple-200">Second Hand → Adverbs</span>
          </div>
        </div>
      </div>

      {/* Digital time for reference */}
      <div className="mt-8 text-slate-500 text-sm font-mono">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default App;