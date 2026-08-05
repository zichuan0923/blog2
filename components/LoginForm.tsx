"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GitHubIcon, Spinner, OrDivider } from "./FormShared";

export default function LoginForm({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("请输入邮箱和密码");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("邮箱格式不正确");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push("/home");
    router.refresh();
  };

  const handleGithub = async (): Promise<void> => {
    await signIn("github", { callbackUrl: "/home" });
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-200 bg-white/80 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          邮箱
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          密码
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 py-3 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "登录中…" : "登录"}
      </button>

      <OrDivider />

      <button
        type="button"
        onClick={handleGithub}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        <GitHubIcon />
        使用 GitHub 登录
      </button>

      <p className="pt-1 text-center text-sm text-zinc-500">
        还没有账号？{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-medium text-slate-600 transition hover:text-slate-800"
        >
          去注册
        </button>
      </p>
    </form>
  );
}
