import { useUser } from "../lib/user-context"
import { EnhancedLoginForm } from "./enhanced-login-form"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useUser()

  if (!isAuthenticated) {
    return <EnhancedLoginForm />
  }

  return <>{children}</>
}
