import { useState } from "react";
import { Mic, Square } from "lucide-react";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { transcribeAudio } from "./services/deepgram";

function App() {
  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recordingError,
  } = useAudioRecorder();
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleStartRecording = async () => {
    setApiError(null);
    setTranscript("");
    await startRecording();
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);
    setApiError(null);

    try {
      const audioBlob = await stopRecording();

      if (!audioBlob) {
        setApiError("No audio recorded");
        return;
      }

      if (audioBlob.size === 0) {
        setApiError("Audio recording is empty");
        return;
      }

      const transcription = await transcribeAudio(audioBlob);
      setTranscript(transcription);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to transcribe audio";
      setApiError(errorMessage);
      console.error("Transcription error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Wispr Voice-to-Text
          </h1>
          <p className="text-slate-600">
            Click to start recording, speak, then stop to see transcription
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleStartRecording}
            disabled={isRecording || isProcessing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isRecording || isProcessing
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            <Mic size={20} />
            Start Recording
          </button>

          <button
            onClick={handleStopRecording}
            disabled={!isRecording || isProcessing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              !isRecording || isProcessing
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
            }`}
          >
            <Square size={20} />
            Stop Recording
          </button>
        </div>

        {isRecording && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-700 font-medium">Recording...</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-700 font-medium">
                Processing transcription...
              </span>
            </div>
          </div>
        )}

        {(recordingError || apiError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {recordingError || apiError}
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Transcription
          </label>
          <textarea
            value={transcript}
            readOnly
            placeholder="Your transcribed text will appear here..."
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50 text-slate-800"
          />
        </div>

        {/*<div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600">
            <strong>Note:</strong> Make sure you have set the{" "}
            <code className="bg-slate-200 px-1 py-0.5 rounded">
              VITE_DEEPGRAM_API_KEY
            </code>{" "}
            environment variable in your{" "}
            <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code> file.
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default App;
