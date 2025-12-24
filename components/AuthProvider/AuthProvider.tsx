"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";
import Loader from "@/components/Loader/Loader";
import type { User } from "@/types/user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const isValid = await checkSession();

        if (isValid) {
          const user: User = await getMe();

          setUser({
            ...user,
            avatar: user.avatar ?? "",
          });
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error("AuthProvider verifySession error:", error);
        clearIsAuthenticated();
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, [setUser, clearIsAuthenticated]);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
