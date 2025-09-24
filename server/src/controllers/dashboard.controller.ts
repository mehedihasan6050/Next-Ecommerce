import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { prisma } from '../server';

export const dashboardStatics = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  
  try {
    // logic here
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'unthorized request' });
      return;
    }

    // Fetch all DELIVERED orders
    const deliveredOrders = await prisma.order.findMany({
      where: {
        items: {
          some: { sellerId: userId },
        },
        status: 'DELIVERED',
      },
      select: {
        userId: true,
        totalPrice: true,
      },
    });

    // Total Sales (sum of totalPrice)
    const totalSales = deliveredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Unique Customers
    const totalCustomers = new Set(deliveredOrders.map(o => o.userId)).size;

    // Total Orders (DELIVERED + PENDING)
    const totalOrders = await prisma.order.count({
      where: {
        items: {
          some: { sellerId: userId },
        },
      },
    });

    // Pending Orders
    const pendingOrders = await prisma.order.count({
      where: {
        items: {
          some: { sellerId: userId },
        },
        status: 'PENDING',
      },
    });



    res.status(200).json({
      totalSales,
      totalCustomers,
      totalOrders,
      pendingOrders,
    });
  } catch (error) {
    res.status(400).json({ error, message: 'something went wrong' });
  }
};

export const dashboardStatsForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {


  try {
    const userId = req.user?.userId;

    if (!userId || req.user?.role !== 'ADMIN') {
      res.status(401).json({ message: 'Unauthorized request' });
      return;
    }

    // Total Orders (all orders)
    const totalOrders = await prisma.order.count();

    // Completed Orders (all DELIVERED orders)
    const completedOrders = await prisma.order.count({
      where: { status: 'DELIVERED' },
    });

    // Total Sales (sum of totalPrice of all DELIVERED orders)
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { totalPrice: true },
    });
    const totalSales = deliveredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Total Customers (exclude sellers & admins)
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER', // assuming role is 'CUSTOMER' for normal users
      },
    });



    res.status(200).json({
      totalOrders,
      completedOrders,
      totalSales,
      totalCustomers,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error, message: 'Something went wrong' });
  }
};
