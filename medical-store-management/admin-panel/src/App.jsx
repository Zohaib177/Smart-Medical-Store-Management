import { Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SetupPage />} />
    </Routes>
  );
}

export default App;
