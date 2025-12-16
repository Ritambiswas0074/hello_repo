import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  cloudinaryId: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export class CloudinaryService {
  /**
   * Sanitize email to create a valid Cloudinary folder name
   * Replaces @ with underscore and removes special characters
   */
  private sanitizeEmailForFolder(email: string): string {
    return email
      .toLowerCase()
      .replace('@', '_at_')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Create folder path based on user email
   * Format: users/{sanitized_email}/media
   */
  private createUserFolder(userEmail: string): string {
    const sanitizedEmail = this.sanitizeEmailForFolder(userEmail);
    return `users/${sanitizedEmail}/media`;
  }

  async uploadMedia(
    file: Express.Multer.File,
    userEmail: string
  ): Promise<UploadResult> {
    // Create folder based on user email
    const folder = this.createUserFolder(userEmail);
    return new Promise((resolve, reject) => {
      // Extract filename without extension for public_id
      const filenameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
      // Sanitize filename for Cloudinary (remove special chars)
      const sanitizedFilename = filenameWithoutExt.replace(/[^a-z0-9_-]/gi, '_');
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
          // Use sanitized filename (folder is already specified above)
          public_id: sanitizedFilename,
          overwrite: false, // Don't overwrite existing files
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error('Upload failed'));
            return;
          }

          const uploadResult: UploadResult = {
            url: result.secure_url,
            cloudinaryId: result.public_id,
            width: result.width,
            height: result.height,
          };

          // For videos, get duration
          if (result.resource_type === 'video' && result.duration) {
            uploadResult.duration = Math.round(result.duration);
          }

          // Generate thumbnail for videos
          if (result.resource_type === 'video') {
            uploadResult.thumbnailUrl = cloudinary.url(result.public_id, {
              resource_type: 'video',
              format: 'jpg',
              transformation: [
                { width: 640, height: 360, crop: 'fill' },
                { quality: 'auto' },
              ],
            });
          }

          resolve(uploadResult);
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteMedia(cloudinaryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(cloudinaryId, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

