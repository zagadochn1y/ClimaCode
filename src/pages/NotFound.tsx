import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 — ClimaCode";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
            <Leaf className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-7xl font-black text-primary mb-2">404</h1>
        <p className="text-xl font-bold mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page <code className="text-sm bg-muted px-2 py-1 rounded">{location.pathname}</code> doesn't exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button className="rounded-full px-6">
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
          </Link>
          <Button variant="outline" className="rounded-full px-6" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
