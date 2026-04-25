import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../entities/auth/hooks/use-login";
import { useCurrentUser } from "../../shared/hooks/use-current-user";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();

  const { mutate, isPending, isError, error, isSuccess } = useLogin();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleLogin = () => {
    setLocalError("");

    if (!phone.trim()) {
      setLocalError("Telefon raqam kiriting");
      return;
    }

    if (!password.trim()) {
      setLocalError("Parol kiriting");
      return;
    }

    mutate({
      phone: phone.trim(),
      password: password.trim(),
    });
  };

  useEffect(() => {
    if (isAuthenticated || isSuccess) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isSuccess, navigate]);

  const serverError =
    (error as any)?.response?.data?.detail ||
    (error as any)?.response?.data?.message ||
    "Login yoki parol noto‘g‘ri";

  return (
    <div
      className="
      relative flex min-h-screen items-center justify-center overflow-hidden
      bg-[#0d6efd]
      px-4
      sm:px-6
      lg:px-8
      "
    >

      <div className="absolute inset-0">

        <div
          className="
          absolute -top-40 left-1/4
          h-[420px] w-[900px]
          rounded-full bg-[#2f4fc4]
          blur-[2px]
          sm:h-[500px] sm:w-[1100px]
          2xl:h-[600px] 2xl:w-[1300px]
          "
        />

        <div
          className="
          absolute top-[220px] left-1/2 -translate-x-1/2
          h-[520px] w-[980px]
          rounded-[120px] bg-[#1473f3]
          sm:h-[600px] sm:w-[1100px]
          2xl:h-[700px] 2xl:w-[1400px]
          "
        />

        <div
          className="
          absolute -bottom-40 -left-20
          h-[300px] w-[420px]
          rounded-full bg-[#3954c7]
          sm:h-[380px] sm:w-[520px]
          2xl:h-[450px] 2xl:w-[600px]
          "
        />
      </div>

   

      <div
        className="
        relative z-10 w-full
        max-w-[520px]
        sm:max-w-[560px]
        lg:max-w-[600px]
        2xl:max-w-[680px]
        "
      >
      

        <div
          className="
          mb-10 flex items-center justify-center gap-4
          sm:gap-5
          2xl:gap-6
          "
        >
          <img
            src="/rename.png"
            alt="Logo"
            className="
            object-contain
            h-[80px] w-[80px]
            sm:h-[90px] sm:w-[90px]
            lg:h-[100px] lg:w-[100px]
            2xl:h-[120px] 2xl:w-[120px]

            "
          />

          <h1
            className="
            font-bold leading-[1.05] text-white
            text-[36px]
            sm:text-[42px]
            lg:text-[46px]
            2xl:text-[56px]
            "
          >
            Raqamli
            <br />
            Nazoratchi
          </h1>
        </div>

      

        <div className="space-y-6 sm:space-y-7 2xl:space-y-8">

          <input
            type="text"
            placeholder="TELEFON RAQAM"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="
            w-full rounded-2xl
            border-2 border-white/80
            bg-transparent
            text-white placeholder:text-white
            outline-none

            h-[56px] px-4 text-lg
            sm:h-[60px] sm:px-5 sm:text-xl
            lg:h-[64px]
            2xl:h-[72px] 2xl:text-[22px]
            "
          />

          <input
            type="password"
            placeholder="PAROL"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
            w-full rounded-2xl
            border-2 border-white/80
            bg-transparent
            text-white placeholder:text-white
            outline-none

            h-[56px] px-4 text-lg
            sm:h-[60px] sm:px-5 sm:text-xl
            lg:h-[64px]
            2xl:h-[72px] 2xl:text-[22px]
            "
          />

          {localError && (
            <p className="text-sm font-medium text-red-200">{localError}</p>
          )}

          {isError && !localError && (
            <p className="text-sm font-medium text-red-200">{serverError}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={isPending}
            className="
            w-full rounded-2xl
            bg-[#e9e9e9]
            font-semibold text-[#2d57d3]
            transition hover:opacity-95

            h-[56px] text-lg
            sm:h-[60px] sm:text-xl
            lg:h-[64px]
            2xl:h-[72px] 2xl:text-[24px]

            disabled:cursor-not-allowed disabled:opacity-70
            "
          >
            {isPending ? "KIRILMOQDA..." : "LOGIN"}
          </button>

        </div>
      </div>
    </div>
  );
}