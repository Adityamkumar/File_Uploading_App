import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

export default function Register() {

 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState("");

 const navigate = useNavigate()

 const handleSubmit = async (e) => {
    e.preventDefault()

    try {
         await axios.post('http://localhost:3000/api/auth/user/register',{
      email, 
      password
    },{
      withCredentials: true
    })
    
    setEmail('')
    setPassword('')

    navigate('/dashboard')

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setErrorMessage(message)
    }
    
 }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm">
        
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Create account
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sign up to start uploading your files
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
             id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="true"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700 transition"
          >
            Register
          </button>
          {errorMessage && (
            <p className="text-red-500 font-sm text-center">{errorMessage}</p>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
