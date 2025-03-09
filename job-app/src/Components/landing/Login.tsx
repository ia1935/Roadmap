import { useState } from "react";
import { LoginForm, LoginResponse } from "../../Interface/Loginform";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/Queries";


function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  //Submitting login form
  const [formData, setFormData] = useState<LoginForm>({
    email:"",
    password:"",
  });
  
  
  // Handle text input changes
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
		  ...prevData,
		  [name]: value,
		}));
	  };
  const handleLogin = (formData:LoginForm) => {


    loginMutation.mutate(formData,
      {
        onSuccess: (data) =>{
          console.log("Login successful: ")
          navigate('/home');
        },
        onError: (error) =>{
          console.error("Login failed: ",error)
      }
      }
    )
    

  }

  return (
    <div className="flex flex-col items-center justify-center h-flex shadow:md p-4 w-full">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleLogin(formData); }}>
          <input
            type="email" id="email" name="email" value={formData.email} onChange={handleTextChange} required
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-3 mb-5 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Email address"
          />
          <input
            type="password" id="password" name="password" value={formData.password} onChange={handleTextChange} required
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-3 mb-5 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Password"
          />
          <div className="flex items-center justify-between flex-wrap">
            <a href="#" className="text-sm text-blue-500 hover:underline mb-0.5">
              Forgot password?
            </a>
          </div>
          <p className="text-gray-900 mt-4">
            Don't have an account? &nbsp;
            
            <a href="/register" className="text-sm text-blue-500 hover:underline">
              Signup
            </a>
          </p>
          <button
            type="submit" disabled={loginMutation.isPending}
            className="ring-2 ring-color-green bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6
             rounded-md mt-5 hover:bg-green-300 hover:from-emerald-500 hover:to-green-500 transition ease-in-out duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;