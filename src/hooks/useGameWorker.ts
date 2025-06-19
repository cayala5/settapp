import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGameWorkerReturn {
  workerMessage: string;
  sendMessage: (message: unknown) => void;
  isWorkerReady: boolean;
}

interface UseGameWorkerOptions {
  onMessage?: (event: MessageEvent) => void;
}

export function useGameWorker(options: UseGameWorkerOptions = {}): UseGameWorkerReturn {
  const { onMessage } = options;
  const [workerMessage, setWorkerMessage] = useState<string>('Initializing worker...');
  const [isWorkerReady, setIsWorkerReady] = useState<boolean>(false);
  const workerRef = useRef<Worker | null>(null);

  // Initialize web worker
  useEffect(() => {
    try {
      // Create the worker
      workerRef.current = new Worker(
        new URL('../gameWorker.ts', import.meta.url),
        { type: 'module' }
      );

      // Set up message handler
      workerRef.current.onmessage = (event) => {
        console.log('Received from worker:', event.data);
        setWorkerMessage(event.data.message || 'Worker responded');
        
        if (event.data.type === 'WORKER_INITIALIZED') {
          setIsWorkerReady(true);
        }

        // Call the custom onMessage handler if provided
        if (onMessage) {
          onMessage(event);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setWorkerMessage('Worker error occurred');
        setIsWorkerReady(false);
      };

      // Send a test message after a short delay
      setTimeout(() => {
        if (workerRef.current) {
          workerRef.current.postMessage({ type: 'TEST', data: 'Hello from React!' });
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to create worker:', error);
      setWorkerMessage('Failed to initialize worker');
      setIsWorkerReady(false);
    }

    // Cleanup function
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [onMessage]);

  const sendMessage = useCallback((message: unknown) => {
    if (workerRef.current && isWorkerReady) {
      workerRef.current.postMessage(message);
    } else {
      console.warn('Worker not ready or not available');
    }
  }, [isWorkerReady]);

  return {
    workerMessage,
    sendMessage,
    isWorkerReady
  };
} 