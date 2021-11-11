import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

export function useAuth() {
  const value = useContext(authContext);

  return value;
}
