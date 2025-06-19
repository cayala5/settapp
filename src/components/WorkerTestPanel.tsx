"use client";

interface WorkerTestPanelProps {
  workerMessage: string;
  isWorkerReady: boolean;
  sendMessage: (message: unknown) => void;
}

export function WorkerTestPanel({
  workerMessage,
  isWorkerReady,
  sendMessage,
}: WorkerTestPanelProps) {
  return (
    <div className="text-center p-4 bg-blue-100 rounded-lg">
      <p className="text-sm text-blue-800">
        Worker Status: {workerMessage} {isWorkerReady ? "✅" : "⏳"}
      </p>
      <button
        onClick={() =>
          sendMessage({ type: "MANUAL_TEST", data: "Button clicked!" })
        }
        disabled={!isWorkerReady}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        Test Worker
      </button>
    </div>
  );
}
