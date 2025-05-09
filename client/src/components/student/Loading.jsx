import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 3000); // Reduced to 3s for better UX
      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
        <div className="absolute inset-2 border-4 border-transparent border-t-blue-300 rounded-full animate-spin-slower"></div>
      </div>
      <p className="mt-6 text-base sm:text-lg font-medium">Redirecting, please wait...</p>
    </div>
  );
};

export default Loading;


