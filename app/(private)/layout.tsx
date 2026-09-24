import type { ReactNode } from "react"
import { AuthProvider } from "../context/auth"

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
