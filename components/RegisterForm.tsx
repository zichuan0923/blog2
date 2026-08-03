"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GitHubIcon, Spinner, OrDivider } from "./FormShared";

export default function RegisterForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("请填写所有字段");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("邮箱格式不正确");
      return;
    }
    if (password.length < 6) {
      setError("密码长度至少为 6 位");
      return;
    }
    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "注册失败，请稍后重试");
        setLoading(false);
        return;
      }

      // 注册成功，自动登录并进入首页
      const login = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (login?.error) {
        setLoading(false);
        setError("注册成功，但自动登录失败，请手动登录");
        onSwitchToLogin();
        return;
      }
      router.push("/home");
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
      setLoading(false);
    }
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
          htmlFor="reg-name"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          用户名
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的昵称"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="reg-email"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          邮箱
        </label>
        <input
          id="reg-email"
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
          htmlFor="reg-password"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          密码
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="至少 6 位"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="reg-confirm"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          确认密码
        </label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="再次输入密码"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 py-3 text-sm font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Spinner />}
        {loading ? "注册中…" : "注册"}
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
        已有账号？{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-slate-600 transition hover:text-slate-800"
        >
          去登录
        </button>
      </p>
    </form>
  );
}