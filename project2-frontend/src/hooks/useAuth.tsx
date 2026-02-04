import { useContext } from "react";
<<<<<<< HEAD
import { AuthContext, AuthContextValue } from "../types/profile";
=======
import { AuthContext, AuthContextValue } from "../util/types";
>>>>>>> 37f76713933f2d99cc9de867b071f1e76270d34e

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context
}