// Converted to .jsx (no TypeScript)
// - Restyled for the dark theme (bg-slate-950, text-white, etc.)
// - Kept all functionality identical.

import { useLocation, Link } from "react-router-dom"; // Import Link
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200 p-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-primary mb-6" />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-lg hover:shadow-primary/40 transition-shadow"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;