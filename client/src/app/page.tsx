'use client'

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const {user} = useAuthStore()
  const router = useRouter();

  useEffect(() => { 

  if(user){
 const redirectPath =
           user.role === "USER"
             ? "/home"
             : user.role === "SELLER"
             ? "/seller"
             : "/admin";
         router.replace(redirectPath);
  }else{
    router.replace('/auth/login')
  }
  },[])


  return (
    <div>
      
    </div>
  );
};

export default Page;