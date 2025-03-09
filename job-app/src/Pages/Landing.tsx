import Header from '../Components/Header';
import Login from '../Components/Landing/Login';


function Landing() {
  return (
    <div className='bg-gray-200  h-screen overflow-hidden '>
      {/* header */}

      <Header />
    
      {/*  main content */} 
      <div className="flex flex-1 items-center p-4 h-full">
      
      <div className="p-8 rounded-lg w-2/5 h-1/2 ">
        <p className="text-left text-gray-700 text-5xl font-semibold md:font-bold">
        Track your job applications and learn how to prepare for interviews!
          </p>
          <br></br>
        
          <p className='font-semibold text-3xl leading md:font-bold text-gray-500'>
            Using Roadmap, users are able to easily keep track of their job applications, provide time-stamped updates, and also obtain vital information in order to ace tech interviews!
            </p>
          
        </div>
       
      </div>
      <div className='absolute right-0 top-1/2 transform -translate-y-1/2 justify-end
      p-8 rounded-lg bgfb h-auto w-3/5 flex flex-col items-center'>
  
  <p className='text-2xl font-semiold text-gray-700 leading-relaxed md:font-bold'>
    Log in or create an account to get started!
  </p>
  <Login />
  
  </div>
    </div>
     
      
    
  );
}

export default Landing;