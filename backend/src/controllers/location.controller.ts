import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const { city, isActive } = req.query;

    const where: any = {};
    if (city) where.city = city as string;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const locations = await prisma.location.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ locations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({ location });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

