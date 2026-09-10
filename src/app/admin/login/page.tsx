"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jadora.gr");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Λάθος email ή κωδικός.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pearl px-4">
      <div className="card-soft w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="J’ADORA Luxury Girls Spa Parties by jo"
            width={120}
            height={120}
            className="h-[110px] w-[110px] object-contain"
            priority
          />
          <h1 className="mt-3 font-serif text-2xl text-dark-berry">Admin Panel</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            required
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 px-3 py-2.5 text-sm outline-none focus:border-mauve"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Κωδικός"
          />
          {error && <p className="text-sm text-deep-rose">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}
