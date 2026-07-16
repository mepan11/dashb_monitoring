import { useState, useEffect } from "react";

export function useRole() {
  const [role, setRole] = useState<string>("admin");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role) {
          let mappedRole = u.role;
          if (mappedRole === "teacher") mappedRole = "guru";
          setRole(mappedRole);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const isPrincipal = role === "kepala_sekolah";
  const isTeacher = role === "guru";
  const isCoach = role === "coach";
  const isAdmin = role === "admin";
  const isReadOnly = role === "kepala_sekolah";

  return { role, isPrincipal, isTeacher, isCoach, isAdmin, isReadOnly, loading };
}
