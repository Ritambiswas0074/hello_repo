import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

