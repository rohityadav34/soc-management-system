import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        
        <h2 className="text-2xl font-bold text-center mb-5">
          Register
        </h2>

        <form>
          
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full mb-3 p-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full mb-4 p-2 border rounded-lg"
          />
          
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
          >
            Register
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer">
          <Link to="/" className="text-blue-500">
            Login
          </Link>
          </span>
        </p>

      </div>

    </div>    
    </>
  )
}

export default Register