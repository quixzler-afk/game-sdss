"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [confirmEmail, setConfirmEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async () => {
      if (
        !username ||
        !email ||
        !confirmEmail ||
        !password ||
        !confirmPassword
      ) {
        alert(
          "Semua field wajib diisi"
        );
        return;
      }

      if (email !== confirmEmail) {
        alert(
          "Email dan konfirmasi email tidak sama"
        );
        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        alert(
          "Password dan konfirmasi password tidak sama"
        );
        return;
      }

      if (password.length < 6) {
        alert(
          "Password minimal 6 karakter"
        );
        return;
      }

      try {
        setLoading(true);

        const {
          data,
          error,
        } =
          await supabase.auth.signUp(
            {
              email,
              password,
              options: {
                data: {
                  username,
                },
              },
            }
          );

        if (error) {
          alert(error.message);
          return;
        }

        if (!data.user) {
          alert(
            "Silakan cek email untuk verifikasi akun."
          );

          router.push("/login");

          return;
        }

        const {
          error:
            profileError,
        } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            username,
            email,
          });

        if (profileError) {
          console.error(
            profileError
          );

          alert(
            "Akun berhasil dibuat tetapi gagal membuat profil."
          );

          return;
        }

        alert(
          "Registrasi berhasil!"
        );

        router.push("/login");
      } catch (error) {
        console.error(error);

        alert(
          "Terjadi kesalahan saat registrasi"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#0B1020]
        text-white
        px-4
      "
    >
      <div className="w-full max-w-md">

        {/* BACK */}
        <button
          onClick={() =>
            router.push("/")
          }
          className="
            flex
            items-center
            gap-2
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
        <div
          className="
            bg-[#111C33]
            border
            border-slate-800
            p-8
            rounded-2xl
          "
        >
          <h1
            className="
              text-3xl
              font-bold
              text-center
              mb-2
            "
          >
            Register
          </h1>

          <p
            className="
              text-slate-400
              text-center
              mb-6
            "
          >
            Buat akun untuk mendapatkan
            rekomendasi game terbaik.
          </p>

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="
              w-full
              mb-4
              px-4
              py-3
              rounded-lg
              bg-[#0B1020]
              border
              border-slate-700
              outline-none
            "
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              mb-4
              px-4
              py-3
              rounded-lg
              bg-[#0B1020]
              border
              border-slate-700
              outline-none
            "
          />

          {/* CONFIRM EMAIL */}
          <input
            type="email"
            placeholder="Konfirmasi Email"
            value={confirmEmail}
            onChange={(e) =>
              setConfirmEmail(
                e.target.value
              )
            }
            className="
              w-full
              mb-4
              px-4
              py-3
              rounded-lg
              bg-[#0B1020]
              border
              border-slate-700
              outline-none
            "
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-[#0B1020]
                border
                border-slate-700
                outline-none
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                absolute
                right-3
                top-3
                text-slate-400
              "
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-6">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Konfirmasi Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="
                w-full
                px-4
                py-3
                rounded-lg
                bg-[#0B1020]
                border
                border-slate-700
                outline-none
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="
                absolute
                right-3
                top-3
                text-slate-400
              "
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={
              handleRegister
            }
            disabled={loading}
            className="
              w-full
              bg-cyan-400
              text-black
              py-3
              rounded-lg
              font-semibold
              hover:opacity-90
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

          {/* LOGIN */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Sudah punya akun?
            </p>

            <button
              onClick={() =>
                router.push(
                  "/login"
                )
              }
              className="
                mt-2
                text-cyan-400
                hover:underline
              "
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}