import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="mb-4 text-6xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! This debate topic doesn't exist</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-hero text-white rounded-lg hover:-translate-y-0.5 transition-all duration-300 hover:shadow-elevated"
        >
          Return to Debates
        </a>
      </div>
    </div>
  );
};

export default NotFound;
