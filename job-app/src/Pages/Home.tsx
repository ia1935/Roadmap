import {Link} from 'react-router-dom';

function Home() {
  return (
    <div className='bg-emerald-100  h-screen'>
    
      <header className="text-lg bg-emerald-700 text-white p-8 rounded-b-lg flex justify-between items-center">
      <h1 className=" text-white rounded text-center font-bold text-4xl ">
        Roadmap - Job Application Tracker
      </h1>

      {/* login page button */}
      <Link to={'/login'}>  
      <button className=" p-4 px-8 bg-white text-black p-2 rounded-xl font-medium ring-2 ring-zinc-400 shadow-lg
      ease-in-out duration-300
      hover:bg-black hover:text-white font-bold hover:ring-emerald-300 ">
        Log in
      </button>
      </Link>
      </header>
    
      {/*  main content */} 
      
      <div className="relative flex flex-col items-start  p-4 ">
        <div className="bg-green-300 p-8 rounded-lg shadow-md w-2/4 h-1/2">
          <p className="text-left text-gray-700 text-5xl leading-relaxed font-semibold md:font-bold">
            Track your job applications and learn how to prepare for interviews!
          </p>
        </div>
        <div className='absolute right-0  justify-end items-center bg- p-8 rounded-lg shadow-md w-1/3 h-1/2'>
        <p className=' text-5xl font-semiold text-gray-700 leading-relaxed md:font-bold '>Click here to get started</p>
        </div>
      </div>
     
      
    </div>
  );
}

export default Home;