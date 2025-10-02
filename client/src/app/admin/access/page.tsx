'use client';


import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/store/useAuthStore';
import { API_ROUTES } from '@/utils/api';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

function AccessPage() {
  const [requestUser, setRequestUser] = useState([])
  const {  roleChange  } = useAuthStore()
  
// Use a ref to track if the request has been made
  const requestMadeRef = useRef(false);
  
  const fetchRequest = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.AUTH}/fetch-request`, {
         withCredentials: true
      })
      setRequestUser(res.data)
    } catch (error) {
      console.log(error)
    }
  } 

useEffect(()=>{
  // Only fetch requests once and never again
  if (!requestMadeRef.current) {
    fetchRequest();
    requestMadeRef.current = true;
  }
}, [])
  
  
  const handleRoleChange = (id: string) => {
    
   Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#2e8b57",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, Approve"
}).then((result) => {
  if (result.isConfirmed) {
    roleChange(id)
      .then(success => {
        if (success) {
      Swal.fire({
      title: "Requested!",
      text: "Approved Successfully",
      icon: "success"
      });
       fetchRequest()   
      }
    })
  }
});
   
  }



  return  <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Request For Seller</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>email</TableHead>
            <TableHead>currentRole</TableHead>
            
            <TableHead>RoleChange</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestUser.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No Orders Found
              </TableCell>
            </TableRow>
          ) : (
            requestUser.map(request => (
              <TableRow key={request?.id}>
                <TableCell className="font-semibold">{request?.id}</TableCell>
                <TableCell>
                  {request?.name}
                </TableCell>
                <TableCell>{request?.email}</TableCell>
                <TableCell>{request?.role}</TableCell>
               
                <TableCell>
                  <Button className="cursor-pointer" onClick={()=>handleRoleChange(request?.id)}>Approve</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>;
}

export default AccessPage;
