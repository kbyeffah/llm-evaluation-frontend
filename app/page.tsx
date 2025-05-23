'use client';

import { useState, useEffect } from 'react';
import { QueryInput } from './components/QueryInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { HeroHighlight, Highlight } from './components/HeroHighlight';
import { motion, AnimatePresence } from 'framer-motion';

// Define TypeScript interfaces to match ResultsDisplay expectations
interface Response {
  model: string;
  responseText: string;
  timeMs: number;
  score: number;
}

interface ResultsData {
  responses: Response[];
  aggregateScore: number;
}

interface AggregateScores {
  [key: string]: number;
}

export default function Home() {
  const [results, setResults] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aggregateScores, setAggregateScores] = useState<AggregateScores>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAggregateScores();
  }, []);

  const fetchAggregateScores = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('/llm/aggregateScores');
        if (!response.ok) throw new Error('Failed to fetch aggregate scores');
        const data = await response.json();
        setAggregateScores(data.aggregateScores);
        setError(null);
        return;
      } catch (error) {
        console.error('Error fetching aggregate scores:', error);
        if (i < retries - 1) await new Promise((resolve) => setTimeout(resolve, delay));
        else setError('Failed to load aggregate scores after multiple attempts.');
      }
    }
  };

  const handleQuerySubmit = async (query: string) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    try {
      const response = await fetch('/experiment/runOnePrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt: query }),
      });
      if (!response.ok) throw new Error('Failed to submit query');
      const data = await response.json();
      setResults(data);
      fetchAggregateScores();
    } catch (error) {
      console.error('Error submitting query:', error);
      setError('Failed to submit query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced animation variants for better visual effects
  const resultsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.3 }
    },
  };

  // Enhanced loading animation variants
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    },
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroHighlight containerClassName="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
        <main className="container mx-auto p-4 sm:p-6 flex flex-col items-center relative z-10">
          {/* Enhanced Navigation */}
          <nav className="relative flex flex-col items-center mb-12 w-full max-w-4xl pt-4 sm:pt-8">
            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-center w-full mb-2"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Highlight className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">
                Eval AI
              </Highlight>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-center max-w-2xl text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
            </motion.p>
            <motion.div
              className="absolute top-4 right-0 sm:top-8 sm:right-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>
          </nav>

          {/* Enhanced Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error-message"
                className="text-red-600 dark:text-red-400 text-center mb-8 p-6 rounded-2xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 max-w-3xl w-full backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Input Card */}
          <motion.div
            className="w-full max-w-4xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />
          </motion.div>

          {/* Enhanced Loading Animation */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loading-spinner"
                className="flex flex-col justify-center items-center mt-12 p-8"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                >
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full relative">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          '0 0 20px 5px rgba(99, 102, 241, 0.3)',
                          '0 0 40px 10px rgba(99, 102, 241, 0.1)',
                          '0 0 20px 5px rgba(99, 102, 241, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
                <motion.p
                  className="mt-6 text-muted-foreground font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Evaluating models...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Results Display */}
          <AnimatePresence>
            {results && !isLoading && (
              <motion.div
                key="results-display"
                className="mt-12 w-full max-w-6xl"
                variants={resultsContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ResultsDisplay
                  results={results}
                  aggregateScores={aggregateScores}
                  variants={resultItemVariants}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Footer */}
          <motion.footer
            className="mt-16 text-center text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >

          </motion.footer>
        </main>
      </HeroHighlight>
    </ThemeProvider>
  );
}