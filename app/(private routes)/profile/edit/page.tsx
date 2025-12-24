"use client";

import css from "./EditProfilePage.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateMe } from "@/lib/api/clientApi";
import { ApiError } from "@/app/api/api";
import Image from "next/image";
const ProfileEdit = () => {
  const route = useRouter();
  const { user } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedMe) => {
      setUser(updatedMe);
      route.push("/profile");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.response?.validation?.body?.message ??
        error.response?.data?.response?.message ??
        error.response?.data?.error ??
        "Oops... some error";

      setError(message);
    },
  });
  async function handleSubmit(formData: FormData) {
    const username = formData.get("username") as string;
    if (!username) {
      setError("Username is required");
      return;
    }
    setError(null);
    mutate({ username });
  }
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user?.avatar && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form action={handleSubmit} className={css.profileInfo}>
          {error && <p className={css.error}>{error}</p>}
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              defaultValue={user?.username}
              id="username"
              type="text"
              name="username"
              className={css.input}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button
              disabled={isPending}
              type="submit"
              className={css.saveButton}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => route.push("/profile")}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEdit;
