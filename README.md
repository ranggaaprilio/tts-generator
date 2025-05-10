# React Text-to-Speech Application

A modern React application that demonstrates the Web Speech API's text-to-speech capabilities using TypeScript and Vite.

## Features

- Convert text to speech using the browser's built-in Web Speech API
- Choose from available system voices
- Adjust speech rate and pitch
- Pause, resume, and stop speech playback
- Clean and responsive user interface
- Chunk the text into small sentences

## Technologies Used

- React 18
- TypeScript
- Vite
- Web Speech API (SpeechSynthesis)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start the Vite development server and open the application in your default browser.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Browser Compatibility

The Web Speech API is supported in most modern browsers, including:

- Chrome
- Edge
- Firefox
- Safari

Note: Voice availability and functionality may vary between browsers and operating systems.

## License

MIT

## Additional Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis Interface](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [React Documentation](https://react.dev)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
