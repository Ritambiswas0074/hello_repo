import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const plans = await prisma.plan.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    res.json({ plans });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ plan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

