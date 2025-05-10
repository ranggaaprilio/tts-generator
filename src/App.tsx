import { useState, useEffect, useRef } from 'react'
import './App.css'

// Utility function to chunk text
const chunkText = (text: string): string[] => {
  const maxChunkLength = 200;
  const chunks: string[] = [];
  
  // Split text into sentences first
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If single sentence is longer than maxChunkLength, split by commas
    if (sentence.length > maxChunkLength) {
      const subParts = sentence.split(',');
      
      for (const part of subParts) {
        if ((currentChunk + part).length > maxChunkLength) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = part;
        } else {
          currentChunk += part + ',';
        }
      }
    } else if ((currentChunk + sentence).length > maxChunkLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

function App() {
  const [text, setText] = useState<string>('Hello! This is a text-to-speech demonstration using React and the Web Speech API.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(1);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);
        
        // Set default voice (first one)
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();

      // Cancel any ongoing speech when component unmounts
      return () => {
        if (synth.current) {
          synth.current.cancel();
        }
      };
    }
  }, []);

  // Function to speak a specific chunk
  const speakChunk = (chunkIndex: number) => {
    if (!synth.current || chunkIndex >= chunksRef.current.length) return;

    const chunk = chunksRef.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utteranceRef.current = utterance;
    
    // Set selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Set speech properties
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Set speech events
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentChunkIndex(chunkIndex);
    };
    
    utterance.onend = () => {
      if (chunkIndex < chunksRef.current.length - 1) {
        speakChunk(chunkIndex + 1);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentChunkIndex(0);
      }
    };

    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    // Start speaking
    synth.current.speak(utterance);
  };

  // Speak the text
  const speak = () => {
    if (!synth.current || !text.trim()) return;

    // Cancel any ongoing speech
    if (synth.current.speaking) {
      synth.current.cancel();
    }

    // Split text into chunks
    const chunks = chunkText(text);
    chunksRef.current = chunks;
    setTotalChunks(chunks.length);
    setCurrentChunkIndex(0);

    // Start speaking from the first chunk
    speakChunk(0);
  };

  // Pause/Resume speech
  const togglePause = () => {
    if (!synth.current) return;

    if (synth.current.speaking) {
      if (isPaused) {
        synth.current.resume();
        setIsPaused(false);
      } else {
        synth.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if (!synth.current) return;
    synth.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="text-to-speech">
      <h1>Text to Speech Converter</h1>
      <div className="description">
        <p>This application demonstrates the Web Speech API's text-to-speech capabilities in React.</p>
        {isSpeaking && (
          <p className="progress">
            Speaking chunk {currentChunkIndex + 1} of {totalChunks}
          </p>
        )}
      </div>

      <div className="controls-container">
        <div className="text-input">
          <label htmlFor="text">Text to speak:</label>
          <textarea 
            id="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            rows={6} 
            placeholder="Type or paste text here to convert to speech..."
          />
        </div>

        <div className="voice-controls">
          <div className="voice-selector">
            <label htmlFor="voice">Voice:</label>
            <select 
              id="voice" 
              value={selectedVoice} 
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang}) {voice.default ? '- Default' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="speech-options">
            <div className="rate-control">
              <label htmlFor="rate">Rate: {rate}</label>
              <input 
                type="range" 
                id="rate" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={rate} 
                onChange={(e) => setRate(parseFloat(e.target.value))} 
              />
            </div>

            <div className="pitch-control">
              <label htmlFor="pitch">Pitch: {pitch}</label>
              <input 
                type="range" 
                id="pitch" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={pitch} 
                onChange={(e) => setPitch(parseFloat(e.target.value))} 
              />
            </div>
          </div>
        </div>

        <div className="playback-controls">
          <button 
            onClick={speak} 
            disabled={isSpeaking && !isPaused}
          >
            Speak
          </button>
          <button 
            onClick={togglePause} 
            disabled={!isSpeaking}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button 
            onClick={stopSpeaking} 
            disabled={!isSpeaking}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
