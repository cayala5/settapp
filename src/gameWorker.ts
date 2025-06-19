// Basic web worker for Set game
console.log("Game worker initialized");

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  console.log("Worker received message:", event.data);

  // Echo back a simple response
  self.postMessage({
    type: "WORKER_READY",
    message: "Worker is running!",
  });
});

// Let the main thread know we're ready
self.postMessage({
  type: "WORKER_INITIALIZED",
  message: "Worker has been initialized",
});
