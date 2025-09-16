"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {toast} from 'sonner'
import CreateCouponModal from "@/components/admin/createCoupon";
import Swal from "sweetalert2";

function AdminCouponsPage() {
  const [createOpen ,setOpen] = useState<boolean>(false)
  const {  couponList, fetchCoupons, deleteCoupon } =
    useCouponStore();
  const fetchCouponRef = useRef(false);

  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchCoupons();
      fetchCouponRef.current = true;
    }
  }, [fetchCoupons]);

  const handleDeleteCoupon = async (id: string) => {
     Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCoupon(id).then(res => {
        if (res)
            Swal.fire({
          title: "Deleted!",
          text: "Your Coupon has been deleted.",
          icon: "success"
          });
        fetchCoupons();
        })
      }
    });
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Coupons</h1>
          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            Add New Coupon
          </Button>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <p className="font-semibold">{coupon.code}</p>
                </TableCell>
                <TableCell>
                  <p>{coupon.discountPercent}%</p>
                </TableCell>
                <TableCell>
                  <p>
                    {coupon.usageCount}/{coupon.usageLimit}
                  </p>
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.startDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.endDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Badge>
                    {new Date(coupon.endDate) > new Date()
                      ? "Active"
                      : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className='cursor-pointer'
                    variant="ghost"
                    size={"sm"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {
        createOpen && <CreateCouponModal onClose={()=> setOpen(false)}/>
      }
    </div>
  );
}

export default AdminCouponsPage;