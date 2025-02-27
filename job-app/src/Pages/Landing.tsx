import Login from '../Components/landing/Login';


function Home() {
  return (
    <div className='bg-emerald-100  h-screen overflow-hidden '>
      {/* header */}
      <div></div>
      <header className="text-lg bg-emerald-700 text-white p-8 rounded-b-lg flex justify-between items-center ">
      <h1 className=" text-white rounded text-center font-bold text-4xl ">
        Roadmap - Job Application Tracker
      </h1>
      </header>
    
      {/*  main content */} 
      <div className="relative flex flex-col items-start p-4 h-full">
      
      <div className="p-8 rounded-lg w-2/5 h-1/2 ">
        <p className="text-left text-gray-700 text-5xl leading-relaxed font-semibold md:font-bold">
        Track your job applications and learn how to prepare for interviews!
          </p>
          <br></br>
        
          <p className='font-semibold text-3xl leading md:font-bold text-gray-500'>Using Roadmap, users are able to easily keep track of their job applications, provide time-stamped updates, and also obtain vital information in order to ace tech interviews!</p>
          
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

export default Home;