import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-shell min-h-[75vh] flex flex-col items-center justify-center py-20 px-4 text-center">
      <span className="font-display text-7xl font-semibold text-gray-100 select-none leading-none">
        404
      </span>
      <h1 className="page-heading mt-4 mb-3">Page not found</h1>
      <p className="body-muted max-w-sm mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
        <button onClick={() => navigate('/')} className="btn-primary">
          <Home className="h-4 w-4" />
          Back to home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
