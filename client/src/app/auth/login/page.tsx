'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import loginImage from '../../../../public/images/loginImage.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { protectSignInAction } from '@/action/auth';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignInAction(
      formData.email
    );

    if (!checkFirstLevelOfValidation.success) {
      toast.error(checkFirstLevelOfValidation.error);
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success('Login Successfull!');
      const user = useAuthStore.getState().user;
    if (user?.role === 'ADMIN') {
       router.push('/admin');
}   else if (user?.role === 'SELLER') {
    router.push('/seller');
}   else {
    router.push('/home');
}

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
              alt="Login"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
              }}
              priority
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex items-center mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold">Next Ecommerce</h2>
            </div>

            {/* Welcome Text */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">Please login to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium text-sm sm:text-base"
                  >
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs sm:text-sm text-orange-500 hover:text-orange-600"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 cursor-pointer text-white font-semibold rounded-lg text-sm sm:text-base mt-2"
              >
                {isLoading ? 'Please Wait' : 'Login'}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6 sm:mt-8">
              <span className="text-gray-500 text-sm sm:text-base">Don&apos;t have an account? </span>
              <Link
                href="/auth/register"
                className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
