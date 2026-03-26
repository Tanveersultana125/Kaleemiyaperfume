import { useState, useEffect } from "react";
import { Mic, X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Groq from "groq-sdk";
import { allProducts, Product } from "@/data/products";

// Initialize Groq
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Greet user when opened
  useEffect(() => {
    if (isOpen) {
      speak("Welcome to Kaleemiya. How can I help you discover your signature scent today?");
    }
  }, [isOpen]);

  // Web Speech API setup
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  }

  const startListening = () => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    setError("");
    setTranscript("");
    setRecommendations([]);
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptValue = event.results[current][0].transcript;
      setTranscript(transcriptValue);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        processVoiceInput(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setError("Error occurred in recognition: " + event.error);
      setIsListening(false);
    };
  }, [transcript]);

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a perfume search mapper for Kaleemiya. Based on the user's speech, output a JSON object with:
            - category: MUST be one of ["perfumes", "attar", "oud", "giftsets"]
            - keywords: 1-2 essential nouns or adjectives from the input (e.g., "rose", "strong", "men")
            Example: User says "I want a strong oud" -> { "category": "oud", "keywords": ["strong"] }
            Example: User says "gift for my sister" -> { "category": "giftsets", "keywords": ["women"] }`
          },
          { role: "user", content: input }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0].message.content || "{}");
      
      const filtered = allProducts.filter(p => {
        // Direct category match
        const categoryMatch = p.category === aiResult.category;
        
        // Keyword match in name
        const nameMatch = aiResult.keywords?.some((kw: string) => 
          p.name.toLowerCase().includes(kw.toLowerCase())
        );

        // Broad match if user mentions specific category word
        const inputLower = input.toLowerCase();
        const brandMatch = inputLower.includes(p.category.toLowerCase()) || (p.category === 'giftsets' && inputLower.includes('gift'));

        return (categoryMatch && nameMatch) || categoryMatch || brandMatch;
      }).slice(0, 4);

      setRecommendations(filtered);
      
      if (filtered.length > 0) {
        speak("I've found some exquisite matches for you.");
      } else {
        speak("I couldn't find a direct match, but here are our favorites.");
        setRecommendations(allProducts.slice(0, 4));
      }

    } catch (err) {
      console.error(err);
      setError("Search processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-primary/10 rounded-full transition-colors group relative"
        title="Voice Search"
      >
        <Mic className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-4xl bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12 flex flex-col items-center text-center">
                <motion.div 
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 relative ${
                    isListening ? 'gold-gradient-bg shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'bg-muted border border-border'
                  }`}
                >
                  <Mic className={`w-10 h-10 ${isListening ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  {isListening && (
                    <motion.div 
                      className="absolute inset-[-10px] border border-primary/30 rounded-full"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>

                <h2 className="font-serif text-3xl mb-4">
                  {isListening ? "Listening..." : transcript ? "Analysis in Progress..." : "How can I help you today?"}
                </h2>
                
                <p className="text-muted-foreground max-w-md italic mb-12 min-h-[1.5em] text-lg">
                  {transcript || '"I want a strong oud for a special night out"'}
                </p>

                <div className="flex gap-4 mb-12">
                  {!isListening && !isProcessing && (
                    <button 
                      onClick={startListening}
                      className="gold-gradient-bg text-primary-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                      <Mic className="w-4 h-4" /> Start Speaking
                    </button>
                  )}
                  {isListening && (
                    <button 
                      onClick={stopListening}
                      className="bg-red-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs flex items-center gap-3 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" /> Stop Recording
                    </button>
                  )}
                </div>

                {isProcessing && (
                  <div className="flex items-center gap-3 text-primary animate-pulse font-serif text-xl">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Consulting our Master Perfumer...
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
                  <AnimatePresence>
                    {recommendations.map((product, i) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-muted/30 border border-border/50 rounded-xl p-4 group hover:border-primary/40 transition-colors"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Result
                          </div>
                        </div>
                        <h3 className="font-serif text-sm mb-1">{product.name}</h3>
                        <p className="text-primary font-bold text-xs mb-2">{product.price}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm uppercase">{product.category}</span>
                          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-sm uppercase tracking-tighter">Recommended</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {error && <p className="text-red-500 mt-8 text-sm">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceSearch;
