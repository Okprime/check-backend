import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class S3Service {
  async uploadFile(imageBuffer: Buffer, fileName: string) {
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Body: imageBuffer,
      Key: fileName,
      ACL: 'public-read',
    };
    // Uploading files to the bucket
    return new Promise(function (resolve, reject) {
      s3.upload(params, function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.Location);
      });
    });
  }
}
