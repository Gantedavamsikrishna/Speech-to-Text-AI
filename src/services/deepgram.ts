const DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen";

interface DeepgramResponse {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
      }>;
    }>;
  };
}

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Deepgram API key not found. Please set VITE_DEEPGRAM_API_KEY in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${DEEPGRAM_API_URL}?model=nova-2&smart_format=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "audio/webm",
        },
        body: audioBlob,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram API error: ${response.status} - ${errorText}`);
    }

    const data: DeepgramResponse = await response.json();

    const transcript =
      data.results?.channels[0]?.alternatives[0]?.transcript || "";

    if (!transcript) {
      throw new Error("No transcription received from Deepgram");
    }

    return transcript;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to transcribe audio");
  }
};
