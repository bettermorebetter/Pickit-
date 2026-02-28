/* ══════════════════════════════════════════════════════════════
   서울 푸드 월드컵 — App root
══════════════════════════════════════════════════════════════ */

import { AppProvider, useApp } from './context/AppContext.tsx';
import LocationScreen from './screens/LocationScreen.tsx';
import MapScreen from './screens/MapScreen.tsx';
import TournamentScreen from './screens/TournamentScreen.tsx';
import ResultScreen from './screens/ResultScreen.tsx';
import AdminScreen from './screens/AdminScreen.tsx';

function ScreenRouter() {
  const { state } = useApp();

  switch (state.screen) {
    case 'location':
      return <LocationScreen />;
    case 'map':
      return <MapScreen />;
    case 'tournament':
      return <TournamentScreen />;
    case 'result':
      return <ResultScreen />;
    case 'admin':
      return <AdminScreen />;
    default:
      return <LocationScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
