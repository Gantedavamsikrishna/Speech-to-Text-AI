# Wispr Voice-to-Text Desktop App

A minimal but fully functional voice-to-text desktop application built with Tauri, React, TypeScript, and Deepgram API.

## Features

- Record audio from your microphone
- Transcribe audio to text using Deepgram's REST API
- Clean, minimal UI built with React and Tailwind CSS
- Cross-platform desktop application powered by Tauri

## Prerequisites

- Node.js (v18 or higher)
- Rust (for Tauri) - Install from https://rustup.rs/
- A Deepgram API key - Get one at https://deepgram.com/

## Setup

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your Deepgram API key:

   ```
   VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
   ```

## Running the App

### Development Mode

Run the desktop app in development mode:

```bash
npm run tauri:dev
```

This will:

- Start the Vite dev server
- Launch the Tauri desktop window
- Enable hot-reload for React changes

### Build for Production

Build the desktop app for your platform:

```bash
npm run tauri:build
```

The built application will be in `src-tauri/target/release/`.

## How to Use

1. Launch the application
2. Click **"Start Recording"** to begin recording audio
3. Speak into your microphone
4. Click **"Stop Recording"** when done
5. Wait for the transcription to appear in the text area

## Architecture

### Frontend (`src/`)

- **App.tsx** - Main UI component with recording controls and transcription display
- **hooks/useAudioRecorder.ts** - Custom React hook for managing audio recording with MediaRecorder API
- **services/deepgram.ts** - Service for communicating with Deepgram REST API

### Desktop Layer (`src-tauri/`)

- Tauri configuration and Rust backend (minimal configuration only)

## Architectural Choices

### Frontend Architecture

- **React with Hooks**: Chose React for its component-based architecture and hooks for state management. The `useAudioRecorder` custom hook encapsulates all audio recording logic, making it reusable and testable.
- **TypeScript**: Used for type safety, especially important for handling audio blobs and API responses.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent styling without complex CSS files.
- **Vite**: Modern build tool for fast development and optimized production builds.

### Audio Processing

- **Browser-Native MediaRecorder API**: Instead of using external libraries, we leverage the browser's built-in MediaRecorder API for audio recording. This choice provides:
  - No additional dependencies
  - Direct access to microphone streams
  - Automatic audio encoding to WebM format
- **Direct API Integration**: Transcription is handled entirely on the client-side with direct REST API calls to Deepgram, eliminating the need for a custom backend service.

### Desktop Application Framework

- **Tauri**: Selected over Electron for its smaller bundle size and better performance. The Rust backend is kept minimal, serving only as a desktop wrapper without custom business logic.

### API Design

- **REST API**: Uses Deepgram's REST API over WebSocket for simplicity. While WebSocket provides real-time transcription, REST was chosen for:
  - Easier error handling
  - Simpler implementation
  - Sufficient for batch transcription use case

## Known Limitations

### Browser Compatibility

- **MediaRecorder Support**: Only works in browsers that support the MediaRecorder API (Chrome 47+, Firefox 25+, Safari 14.1+). Older browsers or certain mobile browsers may not work.
- **WebM Audio Format**: Audio is recorded in WebM format, which may not be compatible with all transcription services.

### Functionality Limitations

- **Live Recording Only**: No support for uploading pre-recorded audio files.
- **No Offline Mode**: Requires internet connection for transcription.
- **Single Language**: Assumes English language input (Deepgram's default).
- **No Real-time Transcription**: Uses batch processing instead of streaming transcription.
- **No Advanced Features**: Lacks diarization, keyword spotting, or custom vocabulary support.

### Security Considerations

- **API Key Exposure**: The Deepgram API key is stored in environment variables with `VITE_` prefix, making it accessible in the client-side bundle. This is acceptable for development but may require backend proxying for production.
- **No Audio Encryption**: Audio data is sent unencrypted over HTTPS to Deepgram.

### Performance Limitations

- **Memory Usage**: Large audio recordings are held in memory as blobs before transmission.
- **Network Dependency**: All transcription requires network requests, with no caching or offline capabilities.
- **Single Request Processing**: Only one transcription request can be processed at a time.

## Assumptions Made During Development

### User Environment

- **Modern Browser**: Assumes users have access to modern browsers with MediaRecorder support.
- **Microphone Access**: Users will grant microphone permissions when prompted.
- **Stable Internet**: Reliable internet connection for API calls.

### Audio Characteristics

- **Microphone Quality**: Assumes standard microphone input quality suitable for speech recognition.
- **English Language**: All audio input is assumed to be in English.
- **Clear Speech**: Speech is assumed to be clear and audible for accurate transcription.

### API Availability

- **Deepgram Service**: Assumes Deepgram API is available and the provided API key is valid with sufficient credits.
- **API Stability**: Assumes Deepgram API endpoints and response formats remain stable.

### Development Environment

- **Node.js and Rust**: Assumes development environment has Node.js 18+ and Rust installed.
- **Build Tools**: Assumes standard build tools (npm, cargo) are available and functional.

### Security Model

- **Client-Side Processing**: Assumes client-side API key storage is acceptable for the use case.
- **HTTPS Communication**: Assumes all API communication happens over HTTPS.

## Tech Stack

- **Tauri** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Deepgram API** - Speech-to-text service
- **MediaRecorder API** - Browser audio recording

## Error Handling

The app handles:

- Microphone permission denial
- Empty audio recordings
- Deepgram API errors
- Network failures

## Troubleshooting

### Microphone Not Working

- Make sure you've granted microphone permissions when prompted
- Check your system's microphone settings

### Transcription Errors

- Verify your Deepgram API key is correct in `.env`
- Check your internet connection
- Ensure your Deepgram account has available credits

### Build Errors

- Make sure Rust is installed: `rustc --version`
- Update Rust: `rustup update`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## License

MIT
