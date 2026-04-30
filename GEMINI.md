# GetRippedMobile - Project Context

## Project Overview
GetRippedMobile is a React Native mobile application built with Expo for workout tracking, creation, and execution. It features a robust offline-first architecture with synchronization capabilities.

### Main Technologies
- **Framework:** [Expo](https://expo.dev/) (SDK 54) / React Native
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with persistence
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Local Storage:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) and [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Language:** TypeScript

## Architecture
The project follows a modular structure within the `src/` directory:
- `app/`: Expo Router route definitions and layouts (Root layout handles auth state and routing).
- `components/`: Reusable UI components grouped by feature (common, dashboard, create-workout).
- `hooks/`: Custom React hooks for business logic (e.g., `useAuth`, `useSyncWorkouts`).
- `lib/`: Library initializations and core service logic (Supabase client, auth helpers).
- `screens/`: Main screen implementations (most routes in `app/` simply render these screens).
- `store/`: Zustand stores for global state management (workouts, toasts, etc.).
- `types/`: TypeScript interfaces and type definitions.

## Building and Running
The following commands are available via npm:
- `npm run start`: Starts the Expo development server.
- `npm run android`: Starts the app on an Android emulator or device.
- `npm run ios`: Starts the app on an iOS simulator or device.
- `npm run web`: Starts the app in a web browser.
- `npm run lint`: Runs ESLint for code quality checks.

## Development Conventions
- **Routing:** All new routes should be added to `src/app/`. Use file-based routing patterns.
- **Styling:** Use Tailwind CSS classes via `className` (NativeWind). Global styles are in `global.css`.
- **State:** Prefer Zustand stores in `src/store/` for global or persisted state.
- **Auth:** Authentication is handled by Supabase. Access auth state via the `useAuth` hook or `RootLayout`.
- **Offline Sync:** Workout data is persisted locally and synced to Supabase when online. Refer to `useSyncWorkouts` and `useWorkoutStore` for implementation details.
- **Types:** Always define TypeScript types/interfaces in `src/types/` for data structures.
