import { Response } from 'express';
import prisma from '../config/database';
import { CloudinaryService } from '../services/cloudinary.service';
import { AuthRequest } from '../types';
import { upload } from '../middleware/upload.middleware';

const cloudinaryService = new CloudinaryService();

export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get templateId and featureType from form data
    const templateId = req.body.templateId;
    const featureType = req.body.featureType; // yourself, loved-ones, family, branding

    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }

    // Verify template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    if (!template.isActive) {
      return res.status(400).json({ error: 'Template is not active' });
    }

    // Get user email from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    });

    if (!user || !user.email) {
      return res.status(404).json({ error: 'User not found or email not available' });
    }

    // Upload to Cloudinary with user email folder structure
    const uploadResult = await cloudinaryService.uploadMedia(req.file, user.email);

    // Determine media type
    const mediaType = req.file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';

    // Validate featureType
    const validFeatureTypes = ['yourself', 'loved-ones', 'family', 'branding'];
    const validatedFeatureType = featureType && validFeatureTypes.includes(featureType) 
      ? featureType 
      : 'yourself'; // Default to 'yourself' if not provided or invalid

    // Save to database with templateId and featureType
    const media = await prisma.media.create({
      data: {
        userId: req.user.userId,
        templateId: templateId,
        featureType: validatedFeatureType, // Store validated featureType
        type: mediaType,
        url: uploadResult.url,
        cloudinaryId: uploadResult.cloudinaryId,
        thumbnailUrl: uploadResult.thumbnailUrl,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Return media with all fields including featureType
    // Prisma returns all fields by default, but we explicitly structure the response
    res.status(201).json({ 
      media: {
        id: media.id,
        userId: media.userId,
        templateId: media.templateId,
        featureType: media.featureType, // Explicitly include featureType
        type: media.type,
        url: media.url,
        cloudinaryId: media.cloudinaryId,
        thumbnailUrl: media.thumbnailUrl,
        filename: media.filename,
        mimeType: media.mimeType,
        size: media.size,
        width: media.width,
        height: media.height,
        duration: media.duration,
        description: media.description,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
        template: media.template,
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { type } = req.query;

    const where: any = { userId: req.user.userId };
    if (type) {
      where.type = type === 'video' ? 'VIDEO' : 'IMAGE';
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        templateId: true,
        featureType: true, // Explicitly include featureType
        type: true,
        url: true,
        cloudinaryId: true,
        thumbnailUrl: true,
        filename: true,
        mimeType: true,
        size: true,
        width: true,
        height: true,
        duration: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ media });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    // Find media
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Check ownership
    if (media.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete from Cloudinary
    await cloudinaryService.deleteMedia(media.cloudinaryId);

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Export upload middleware for use in routes
export { upload };

