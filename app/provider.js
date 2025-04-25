"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      CheckIsNewUser();
    }
  }, [isLoaded, user]);

  const CheckIsNewUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !user?.fullName) return;

    try {
      setIsChecking(true);
      const resp = await axios.post("/api/create-user", {
        user: {
          userName: user.fullName, // Match the database field name exactly
          email: user.primaryEmailAddress.emailAddress,
        },
      });
      console.log("User check/creation successful:", resp.data);
    } catch (error) {
      console.error("Error checking/creating user:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return <div className="min-h-screen">{children}</div>;
}

export default Provider;
