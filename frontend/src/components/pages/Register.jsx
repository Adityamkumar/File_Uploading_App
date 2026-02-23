import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cloud, ArrowRight, Mail, Lock, Loader2, UserPlus } from "lucide-react";
import DotGrid from "@/components/DotGrid";
import api from "@/api";

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post(`/api/auth/user/register`, { email, password }, { withCredentials: true })
      setEmail('')
      setPassword('')
      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setErrorMessage(message)
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-100 relative overflow-hidden px-4 selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <DotGrid 
            dotSize={2} 
            gap={40} 
            baseColor="rgba(255,255,255,0.05)" 
            activeColor="rgba(59,130,246,0.3)" 
        />
      </div>

      {/* Dynamic Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass rounded-[2rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group hover:scale-110 transition-transform duration-500">
              <UserPlus className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-zinc-400 text-center">Join Droply today and secure your files in the cloud.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in shake duration-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
