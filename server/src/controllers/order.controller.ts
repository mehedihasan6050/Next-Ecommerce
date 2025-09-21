import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { NextFunction, Response } from 'express';
import { prisma } from '../server';
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);

export const paymentIntent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productIds, totalPrice } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (!products || products.length === 0) {
      res.status(400).send({ message: 'Products Not Found' });
      return;
    }

    const price = totalPrice * 100; // total price in cent (poysha)
    const { client_secret } = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({ clientSecret: client_secret });
  } catch (e) {
    console.log(e, 'payment faild');

    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items, addressId, couponId, totalPrice, paymentId } = req.body;
    const userId = req.user?.userId;

    console.log(items, 'itemsitemsitems');

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    //start our transaction

    const order = await prisma.$transaction(async prisma => {
      //create new order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          couponId,
          totalPrice,
          paymentMethod: 'CREDIT_CARD',
          paymentStatus: 'COMPLETED',
          paymentId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              productCategory: item.productCategory,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: {
          cart: { userId },
        },
      });

      await prisma.cart.delete({
        where: { userId },
      });

      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (e) {
    console.log(e, 'createFinalOrder');

    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};

export const getOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
        address: true,
        coupon: true,
      },
    });

    res.status(200).json(order);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    await prisma.order.updateMany({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};

export const getAllOrdersForAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};

export const getOrdersByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthenticated user',
      });

      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: true,
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(orders);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Unexpected error occured!',
    });
  }
};
