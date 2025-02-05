import './App.css';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import environment from './environment';

function App() {
  return <RouterProvider router={router} basepath={environment.publicPath} />;
}

export default App;
