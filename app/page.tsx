'use client';

import { useState, useEffect } from 'react';
import { QueryInput } from './components/QueryInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { HeroHighlight, Highlight } from './components/HeroHighlight';
import { motion } from 'framer-motion';

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

  // Animation variants for the results display (staggered effect)
  const resultsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const resultItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroHighlight containerClassName="min-h-screen">
        <main className="container mx-auto p-4 sm:p-6 flex flex-col items-center">
          <nav className="relative flex flex-col items-center mb-8 w-full max-w-3xl pt-4 sm:pt-8">
            <motion.h1
              className="text-2xl sm:text-4xl font-bold text-center w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Highlight>Nural AI</Highlight>
            </motion.h1>
            <motion.div
              className="absolute top-4 right-0 sm:top-8 sm:right-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ThemeToggle />
            </motion.div>
          </nav>

          {error && (
            <motion.div
              key="error-message"
              className="text-red-500 text-center mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 max-w-3xl w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="w-full max-w-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-teal-900/30 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <QueryInput onSubmit={handleQuerySubmit} isLoading={isLoading} />
          </motion.div>

          {isLoading && (
            <motion.div
              key="loading-spinner"
              className="flex justify-center items-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full relative"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: '0 0 15px 5px rgba(99, 102, 241, 0.5)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 15px 5px rgba(99, 102, 241, 0.5)',
                      '0 0 25px 10px rgba(99, 102, 241, 0.3)',
                      '0 0 15px 5px rgba(99, 102, 241, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          )}

          {results && (
            <motion.div
              key="results-display"
              className="mt-8 w-full max-w-3xl"
              variants={resultsContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <ResultsDisplay
                results={results}
                aggregateScores={aggregateScores}
                variants={resultItemVariants}
              />
            </motion.div>
          )}
        </main>
      </HeroHighlight>
    </ThemeProvider>
  );
}