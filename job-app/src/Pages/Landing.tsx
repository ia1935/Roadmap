import Header from '../Components/Header';
import Login from '../Components/Landing/Login';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Left column - Product information */}
        <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Track your job applications and ace your interviews
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Roadmap helps you organize your job search journey with powerful tracking tools and interview preparation resources.
          </p>
          
          {/* Feature highlights - simplified as text bullets */}
          <div className="space-y-6 mt-6">
            {/* Application Tracking */}
            <div className="flex">
              <div className="text-blue-600 font-bold text-xl mr-3">•</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Application Tracking</h3>
                <p className="text-gray-600">Keep all your job applications organized in one place</p>
              </div>
            </div>
            
            {/* Status Updates */}
            <div className="flex">
              <div className="text-green-600 font-bold text-xl mr-3">•</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Status Updates</h3>
                <p className="text-gray-600">Log time-stamped updates to monitor your progress</p>
              </div>
            </div>
            
            {/* Interview Resources */}
            <div className="flex">
              <div className="text-purple-600 font-bold text-xl mr-3">•</div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Interview Resources</h3>
                <p className="text-gray-600">Access helpful resources to prepare for tech interviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Login/signup form */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 md:p-10 flex flex-col">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Get Started Today
            </h2>
            <p className="text-gray-600">
              Log in or create an account to begin tracking your job search journey
            </p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <Login />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
      
      {/* Footer with subtle branding */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Roadmap • Your journey to career success
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;