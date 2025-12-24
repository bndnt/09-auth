"use client";

import css from "./SignUpPage.module.css";
import { register } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/app/api/api";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const setUser = useAuthStore((store) => store.setUser);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setUser(data);
      router.push("/profile");
    },
    onError: (error) => {
      setError(
        (error as ApiError).response?.data?.error ?? (error as ApiError).message
      );
    },
  });

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email, password });
    mutate({ email, password });
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            Register
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
