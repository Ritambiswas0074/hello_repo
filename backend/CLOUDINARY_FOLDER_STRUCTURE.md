# Cloudinary Folder Structure

## Overview

All media uploads (images and videos) are now organized by user email in Cloudinary. Each user has their own dedicated folder structure.

## Folder Structure

```
users/
  └── {sanitized_email}/
      └── media/
          ├── image1.jpg
          ├── image2.png
          ├── video1.mp4
          └── video2.mov
```

### Example

For a user with email `john.doe@example.com`:
- **Folder Path**: `users/john_doe_at_example_com/media/`
- **Full Cloudinary Path**: `users/john_doe_at_example_com/media/filename`

## Email Sanitization

The user's email is sanitized to create a valid Cloudinary folder name:

1. **Convert to lowercase**: `John.Doe@Example.com` → `john.doe@example.com`
2. **Replace @ with _at_**: `john.doe@example.com` → `john.doe_at_example.com`
3. **Remove special characters**: `john.doe_at_example.com` → `john_doe_at_example_com`
4. **Clean up multiple underscores**: `john__doe` → `john_doe`
5. **Remove leading/trailing underscores**: `_john_doe_` → `john_doe`

### Sanitization Examples

| Original Email | Sanitized Folder |
|---------------|------------------|
| `user@example.com` | `user_at_example_com` |
| `john.doe+test@company.co.uk` | `john_doe_test_at_company_co_uk` |
| `user_name@domain-name.com` | `user_name_at_domain_name_com` |
| `test123@email.io` | `test123_at_email_io` |

## Implementation Details

### CloudinaryService

The `CloudinaryService` class includes:

1. **`sanitizeEmailForFolder(email: string)`**: Sanitizes email for folder name
2. **`createUserFolder(userEmail: string)`**: Creates folder path `users/{sanitized_email}/media`
3. **`uploadMedia(file, userEmail)`**: Uploads file to user's folder

### Upload Flow

1. User uploads a file via `/api/upload`
2. Backend fetches user's email from database
3. Email is sanitized and folder path is created
4. File is uploaded to Cloudinary in the user's folder
5. Media record is saved in database with Cloudinary URL

### Code Example

```typescript
// In upload.controller.ts
const user = await prisma.user.findUnique({
  where: { id: req.user.userId },
  select: { email: true },
});

const uploadResult = await cloudinaryService.uploadMedia(req.file, user.email);
// File is uploaded to: users/{sanitized_email}/media/filename
```

## Benefits

1. **Organization**: All user media is grouped by user email
2. **Easy Management**: Admins can easily find and manage user files
3. **Scalability**: Each user has their own folder, preventing conflicts
4. **Security**: Files are organized by user, making access control easier
5. **Clean Structure**: Consistent folder naming across all users

## Cloudinary Console

In the Cloudinary Media Library, you'll see:

```
📁 users/
  📁 john_doe_at_example_com/
    📁 media/
      🖼️ image1.jpg
      🖼️ image2.png
      🎥 video1.mp4
  📁 jane_smith_at_test_com/
    📁 media/
      🖼️ photo1.jpg
      🎥 clip1.mp4
```

## Notes

- **Folder Creation**: Cloudinary automatically creates folders when files are uploaded
- **File Naming**: Original filenames are sanitized but preserved as much as possible
- **No Overwrite**: Files with the same name won't overwrite (Cloudinary adds unique suffixes)
- **Case Insensitive**: All folder names are lowercase for consistency
- **Special Characters**: Special characters in emails are replaced with underscores

## Migration

Existing files uploaded before this change will remain in the old location (`featureme/` folder). New uploads will use the user-based folder structure.

To migrate existing files:
1. Query database for all media records
2. Get user email for each media
3. Use Cloudinary Admin API to move files to new folder structure
4. Update `cloudinaryId` in database if needed

