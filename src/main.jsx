import { createRoot } from 'react-dom/client'
import App from './App.jsx' // Your import is correct!
import './index.css'
import 'leaflet/dist/leaflet.css';

// 1. Find the root element in your index.html
const container = document.getElementById("root");

// 2. Check if the element actually exists before trying to render
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  // Log a clear error if the <div> is missing
  console.error("Failed to find the root element. Make sure your index.html file has <div id='root'></div>");
}