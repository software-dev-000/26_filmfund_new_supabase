import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client with credentials
const s3Client = new S3Client({
  forcePathStyle: true,
  region: import.meta.env.VITE_SUPABASE_S3_REGION,
  endpoint: import.meta.env.VITE_SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_SUPABASE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_SUPABASE_S3_SECRET_KEY,
  },
});

export const s3Service = {
  /**
   * Upload a file directly to Supabase storage using S3 credentials
   * @param bucket The storage bucket name
   * @param path The path within the bucket
   * @param file The file to upload
   * @returns The URL of the uploaded file
   */
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      console.log(`Uploading file to S3: ${bucket}/${path}`);
      
      // Convert File to ArrayBuffer, then to Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: uint8Array,
        ContentType: file.type,
      });
      
      await s3Client.send(command);
      
      // Generate a signed URL that expires in 1 day
      const urlCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
      });
      
      const signedUrl = await getSignedUrl(s3Client, urlCommand, { expiresIn: 86400 });
      
      // Return the public URL
      return `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  },

  /**
   * Delete a file from Supabase storage
   * @param bucket The storage bucket name
   * @param path The path within the bucket
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
      });
      
      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      // throw error;
    }
  },

  async getFileUrl(bucket: string, path: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
      });
      
      // Generate a signed URL that expires in 1 hour
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }
};