"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getUser } from "../services/auth.service";

export function useAuth() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser =
    async () => {
      const currentUser =
        await getUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

  return {
    user,
    loading,
  };
}