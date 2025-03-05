const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h2>
                <form className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Username"
                        className="bg-gray-100 text-gray-900 border-0 rounded-md p-3 mb-5 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-gray-100 text-gray-900 border-0 rounded-md p-3 mb-5 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="bg-gray-100 text-gray-900 border-0 rounded-md p-3 mb-5 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                    />
                    <button
                        type="submit"
                        onClick={() => console.log('Register')}
                        className="ring-2 ring-color-green bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-md mt-5 hover:bg-green-300 hover:from-emerald-500 hover:to-green-500 transition ease-in-out duration-300"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
