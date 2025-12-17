import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { GENERAL_UI } from "@/Sim/Content";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{GENERAL_UI.ERRORS.PAGE_NOT_FOUND.TITLE}</h1>
        <p className="text-xl text-gray-600 mb-4">{GENERAL_UI.ERRORS.PAGE_NOT_FOUND.MESSAGE}</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          {GENERAL_UI.BUTTONS.RETURN_TO_HOME}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
