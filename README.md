# Medcare-Support

## Setup and development commands

### Async Storage

Async Storage provides persistent key-value storage for React Native applications.
See the [Async Storage npm package](https://www.npmjs.com/package/@react-native-async-storage/async-storage) for documentation.

For an Expo project, install the Expo-compatible version:

```bash
npx expo install @react-native-async-storage/async-storage
```

Alternatively, install the package directly with npm:

```bash
npm i @react-native-async-storage/async-storage
```

### Expo App Loading

Install Expo App Loading for controlling the loading screen while application resources are prepared:

```bash
npm install expo-app-loading
```

### Image Picker

Install Expo Image Picker to let users select images or take photos:

```bash
npx expo install expo-image-picker
```

### React Navigation

Install React Navigation, native stack navigation, and their required native dependencies:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

### Start the development server

Start Expo and clear the bundler cache:

```bash
npx expo start --clear
```

Force Expo to launch in Expo Go mode, use a tunnel connection, and clear the bundler cache:

```bash
npx expo start --go --tunnel --clear
```
