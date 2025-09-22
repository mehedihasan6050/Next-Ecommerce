'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

function AccessPage() {
  const { fetchRequest, roleChange, requestUser } = useAuthStore()
  
useEffect(()=>{
  fetchRequest()
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

console.log(requestUser)

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
