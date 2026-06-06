"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { login } from "../../services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const { error } = await login(email, password);

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const ensureProfile = async (userId: string, email: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!data) {
    await supabase.from("profiles").insert({
      id: userId,
      username: email.split("@")[0],
    });
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0B1020] text-white px-4">

      <div className="w-full max-w-md">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="
            flex items-center gap-2
            text-slate-400
            mb-4
            hover:text-white
            transition
          "
        >
          <ArrowLeft size={18} />
          Kembali ke Home
        </button>

        {/* CARD */}
        <div className="bg-[#111C33] border border-slate-800 p-8 rounded-2xl">

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Login
          </h1>

          <p className="text-slate-400 mb-6 text-center">
            Masuk untuk mendapatkan rekomendasi game terbaik.
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full mb-4 px-4 py-3
              rounded-lg
              bg-[#0B1020]
              border border-slate-700
              outline-none
            "
          />

          {/* PASSWORD */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-4 py-3
                rounded-lg
                bg-[#0B1020]
                border border-slate-700
                outline-none
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full bg-cyan-400 text-black
              py-3 rounded-lg font-semibold
              hover:opacity-90
              disabled:opacity-50
              transition
            "
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* REGISTER LINK */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Belum punya akun?
            </p>

            <button
              onClick={() => router.push("/register")}
              className="mt-2 text-cyan-400 font-medium hover:underline"
            >
              Register
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}