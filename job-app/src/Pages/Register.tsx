
function Register(){
    return(
        <div className='bg-emerald-100 h-screen flex items-center justify-center'>
            <div className="text-center">
            <form>
                <input type="text" placeholder="First Name" className="p-2 m-2 rounded-md"/>
                <input type="text" placeholder="Last Name" className="p-2 m-2 rounded-md"/>
                <input type="email" placeholder="Email" className="p-2 m-2 rounded-md"/>
                <input type="password" placeholder="Password" className="p-2 m-2 rounded-md"/>
            </form>
            </div>
        </div>
    )
}
export default Register;