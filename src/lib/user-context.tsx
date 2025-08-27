"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User } from "./types"

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  logout: () => void
  isAdmin: boolean
  isManager: boolean
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Check for existing session on mount - optimized for speed
  useEffect(() => {
    // Use requestIdleCallback for non-blocking localStorage access
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem("autocare_user")
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser))
        }
      } catch (error) {
        localStorage.removeItem("autocare_user")
      }
    }

    // Use setTimeout with 0 delay for next tick execution (faster than useEffect)
    const timer = setTimeout(checkSession, 0)
    return () => clearTimeout(timer)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("autocare_user", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("autocare_user")
    }
  }, [currentUser])

  const isAdmin = currentUser?.user_type === "admin"
  const isManager = currentUser?.user_type === "office_manager"
  const isAuthenticated = !!currentUser

  const logout = () => {
    setCurrentUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        isAdmin,
        isManager,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Helper function to switch users for demo purposes
export function createDemoUser(type: "admin" | "office_manager"): User {
  return {
    id: type === "admin" ? 1 : 2,
    username: type === "admin" ? "admin" : "manager",
    email: type === "admin" ? "admin@autocare.co.tz" : "manager@autocare.co.tz",
    full_name: type === "admin" ? "Admin User" : "Manager User", 
    user_type: type,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }
}
