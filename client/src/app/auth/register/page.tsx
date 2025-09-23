"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import loginImage from "../../../../public/images/loginImage.jpg"
import Image from "next/image"
import Link from "next/link"
import {toast} from 'sonner'
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { protectSignUpAction } from "@/action/auth"



function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignUpAction(
      formData.email
    );
    if (!checkFirstLevelOfValidation.success) {
      toast.error(checkFirstLevelOfValidation.error);
      return;
    }

    const userId = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (userId) {
      toast.success("Registration Successfull!");
      router.push("/auth/login");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
          {/* Left Side - Image (hidden on small screens) */}
          <div className="hidden lg:block lg:w-1/2 p-6 sm:p-8 lg:p-12 flex-col justify-center relative">
          <Image
          src={loginImage}
          alt="Register"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', width: '100%' , height: '100%' }}
          priority
        />
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex items-center mb-6 sm:mb-8">
             <h2 className="text-lg sm:text-xl font-bold">Next Ecommerce</h2>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm sm:text-base">Please register to get started</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 h-10 sm:h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 h-10 sm:h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="h-10 sm:h-12 bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 pr-12 text-sm sm:text-base"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleOnChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 sm:h-12 cursor-pointer text-white font-semibold rounded-lg text-sm sm:text-base mt-2">
                {isLoading ? "Please Wait" : "Register"}
              </Button>
            </form>

           
            {/* Sign Up Link */}
            <div className="text-center mt-6 sm:mt-8">
              <span className="text-gray-500 text-sm sm:text-base">Already have an account? </span>
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage