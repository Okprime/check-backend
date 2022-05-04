// import { Res, Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as AWS from 'aws-sdk';
// import { UsersService } from 'src/user/user.service';
// import { Repository } from 'typeorm';
// import { FileUpload } from './entities/file-upload.entity';

// const AWS_S3_BUCKET_NAME =
//   process.env.AWS_S3_BUCKET_NAME || 'rise-vest/rise-vest';
// const s3 = new AWS.S3();
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// @Injectable()
// export class ImageUploadService {
//   constructor(
//     @InjectRepository(FileUpload)
//     private fileUploadRepository: Repository<FileUpload>,
//     private usersService: UsersService,
//   ) {}

//   async uploadFile(
//     imageBuffer: Buffer,
//     fileName: string,
//     @Res() res,
//     userId: string,
//   ) {
//     // get user by Id
//     const user = await this.usersService.getUserById(userId);

//     // Setting up S3 upload parameters
//     const params = {
//       Bucket: AWS_S3_BUCKET_NAME,
//       Body: imageBuffer,
//       Key: fileName,
//       ACL: 'public-read',
//     };
//     const v = this.fileUploadRepository;
//     // Uploading files to the bucket
//     // try {
//     s3.upload(params, async function (err, data) {
//       if (data) {
//         // save location of the file to the db
//         const newFileUploadPayload = new FileUpload();
//         // newFileUploadPayload.user = user;
//         newFileUploadPayload.fileName = fileName;
//         newFileUploadPayload.fileURL = data.Location;

//         await v.save(newFileUploadPayload);
//         return res.status(201).json({ message: 'File uploaded successfully' });
//       }
//       return res.status(400).json({ message: err });
//     });
//   }

//   async getAllUploadedFiles(userId: string, offset: number, limit: number) {
//     const user = await this.usersService.getUserById(userId);
//     // if (user.userRole === 'user') {
//     //   throw new BadRequestException('Sorry, you cannot perfom this action');
//     // }
//     const query = await this.fileUploadRepository
//       .createQueryBuilder('fileUpload')
//       .where('fileUpload.isDeleted is false')
//       .andWhere('fileUpload.isUnsafe is false')
//       .skip(offset)
//       .take(limit);
//     return query.getMany();
//   }

//   async getMyUploadedFiles(userId: string, offset: number, limit: number) {
//     const query = await this.fileUploadRepository
//       .createQueryBuilder('fileUpload')
//       .where('fileUpload.user =:user', { user: userId })
//       .andWhere('fileUpload.isDeleted is false')
//       .andWhere('fileUpload.isUnsafe is false')
//       .skip(offset)
//       .take(limit);
//     return query.getMany();
//   }

//   async markFileAsUnsafe(fileId: string, userId: string) {
//     // get user info to detemine the role
//     const user = await this.usersService.getUserById(userId);
//     // if (user.userRole === 'user') {
//     //   throw new BadRequestException('Sorry, you cannot perfom this action');
//     // }
//     const isUnsafe = true;
//     const isDeleted = true;
//     return this.fileUploadRepository.update(
//       { id: fileId },
//       { isUnsafe, isDeleted },
//     );
//   }
// }
