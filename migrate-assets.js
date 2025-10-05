import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new AWS.S3({ region: 'ap-south-1' });

async function uploadDirectory(localPath, s3Prefix, bucketName) {
  const files = fs.readdirSync(localPath);
  
  for (const file of files) {
    const filePath = path.join(localPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${s3Prefix}/${file}`, bucketName);
    } else {
      const fileContent = fs.readFileSync(filePath);
      const key = `${s3Prefix}/${file}`;
      
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: getContentType(file)
      };
      
      await s3.upload(params).promise();
      console.log(`Uploaded: ${key}`);
    }
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
  };
  return types[ext] || 'application/octet-stream';
}

// Usage
const bucketName = 'nowest-interior-assets-dev'; // Update with your bucket name

uploadDirectory('./attached_assets/stock_images', 'stock_images', bucketName)
  .then(() => uploadDirectory('./attached_assets/brochures', 'brochures', bucketName))
  .then(() => console.log('All assets uploaded successfully!'))
  .catch(console.error);
