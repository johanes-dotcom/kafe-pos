import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Untuk keperluan demo, kita langsung arahkan ke dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mokkaCream p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center mb-4">
            <img src={logo} alt="Caffe Moka Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-mokkaDark">Caffe Moka</h1>
          <p className="text-gray-500 mt-1">Silakan login untuk melanjutkan</p>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-600">Alamat Email</label>
              <input
                type="email"
                defaultValue="admin@moka.com"
                placeholder="contoh@email.com"
                className="mt-2 w-full h-12 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Password</label>
              <input
                type="password"
                defaultValue="password"
                placeholder="••••••••"
                className="mt-2 w-full h-12 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
              />
            </div>
            <button type="submit" className="w-full h-12 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition shadow-lg">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;