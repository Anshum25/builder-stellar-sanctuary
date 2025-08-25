import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            QuizMaster
          </h1>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-gray-300 mb-4">404</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h3>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
