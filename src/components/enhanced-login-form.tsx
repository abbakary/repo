"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useUser, createDemoUser } from "@/lib/user-context"

// Particle component for floating animation
const Particle = ({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) => {
  return (
    <div
      className="absolute w-2 h-2 bg-yellow-200 rounded-full opacity-20 animate-pulse"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animation: `float ${duration}s infinite ${delay}s ease-in-out`,
      }}
    />
  )
}

// Floating tire animation component
const MovingTire = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* First tire */}
      <div
        className="tire-container absolute top-1/2 transform -translate-y-1/2"
        style={{
          animation: 'moveTire 8s linear infinite',
          left: '-200px',
        }}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Feb7c259a701147c18f9b0bd157a7f55e%2Fb8133418b26f42ecb77ba0be17c056b0?format=webp&width=800"
          alt="Moving Tire"
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
            animation: 'rotateTire 2s linear infinite',
          }}
        />
      </div>

      {/* Second tire (delayed) */}
      <div
        className="tire-container absolute top-1/2 transform -translate-y-1/2"
        style={{
          animation: 'moveTire 8s linear infinite',
          animationDelay: '4s',
          left: '-200px',
        }}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Feb7c259a701147c18f9b0bd157a7f55e%2Fb8133418b26f42ecb77ba0be17c056b0?format=webp&width=800"
          alt="Moving Tire"
          className="w-24 h-24 md:w-40 md:h-40 lg:w-52 lg:h-52 object-contain opacity-70"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
            animation: 'rotateTire 1.8s linear infinite',
          }}
        />
      </div>
    </div>
  )
}

export function EnhancedLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"admin" | "office_manager">("admin")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; startX: number; startY: number }>>([])
  
  const { setCurrentUser } = useUser()

  // Generate floating particles on component mount
  useEffect(() => {
    const particleArray = []
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
      })
    }
    setParticles(particleArray)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const validCredentials = {
        admin: { username: "admin", password: "admin123" },
        office_manager: { username: "manager", password: "manager123" }
      }

      const creds = validCredentials[userType]
      if (username === creds.username && password === creds.password) {
        const user = createDemoUser(userType)
        setCurrentUser(user)
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes moveTire {
          0% {
            transform: translateX(0px) translateY(-50%);
          }
          100% {
            transform: translateX(calc(100vw + 300px)) translateY(-50%);
          }
        }
        
        @keyframes rotateTire {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.6;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .particle-bg {
          background: linear-gradient(-45deg, #fef3c7, #fde68a, #fcd34d, #f59e0b, #d97706);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="min-h-screen flex flex-col md:flex-row particle-bg relative overflow-hidden">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
            startX={particle.startX}
            startY={particle.startY}
          />
        ))}

        {/* Left Side - Moving Tire (visible on all screens) */}
        <div className="flex w-full md:w-1/2 relative items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-300 overflow-hidden min-h-[200px] md:min-h-screen">
          <div className="absolute inset-0 bg-black bg-opacity-5"></div>

          {/* Multiple tire instances for continuous effect */}
          <MovingTire />

          {/* Welcome Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-4 md:p-8">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
              Welcome to
            </h1>
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-yellow-100 mb-4 md:mb-8 drop-shadow-lg">
              Superdoll
            </h2>
            <p className="text-sm md:text-xl text-white max-w-md leading-relaxed drop-shadow-md">
              Professional car service tracking and management system
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 lg:p-8 relative">
          <div className="w-full max-w-md">
            <Card className="glass-effect border-0 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center">
                    <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">
                  Superdoll
                </CardTitle>
                <CardDescription className="text-yellow-100 text-lg">
                  Car Service Management System
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleLogin}>
                <CardContent className="space-y-6 px-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-500 bg-opacity-90 border-red-600 text-white">
                      <AlertDescription className="text-white">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="userType" className="text-white font-semibold text-lg">
                      User Type
                    </Label>
                    <Select value={userType} onValueChange={(value: "admin" | "office_manager") => setUserType(value)}>
                      <SelectTrigger className="h-12 bg-white bg-opacity-90 border-yellow-300 text-gray-800 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="office_manager">Office Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-white font-semibold text-lg">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gray-600" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-12 h-12 bg-white bg-opacity-90 border-yellow-300 text-gray-800 text-lg placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white font-semibold text-lg">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-600" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 bg-white bg-opacity-90 border-yellow-300 text-gray-800 text-lg placeholder:text-gray-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 p-4 rounded-lg text-sm space-y-3 backdrop-blur-sm">
                    <p className="font-bold text-white mb-3 text-lg">Quick Demo Login:</p>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-yellow-200 border-yellow-300 text-gray-700 hover:bg-yellow-100 font-semibold"
                        onClick={() => {
                          setUserType("admin")
                          setUsername("admin")
                          setPassword("admin123")
                        }}
                      >
                        Fill Admin
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-yellow-200 border-yellow-300 text-gray-700 hover:bg-yellow-100 font-semibold"
                        onClick={() => {
                          setUserType("office_manager")
                          setUsername("manager")
                          setPassword("manager123")
                        }}
                      >
                        Fill Manager
                      </Button>
                    </div>
                    <p className="text-yellow-100 text-sm">
                      <strong>Admin:</strong> admin / admin123 • <strong>Manager:</strong> manager / manager123
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-yellow-300 to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-gray-800 font-bold text-lg shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
