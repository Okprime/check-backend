// import {
//   Controller,
//   Post,
//   Res,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
//   BadRequestException,
//   Get,
//   Query,
//   Param,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiConsumes,
//   ApiOkResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { plainToClass } from 'class-transformer';
// import { AuthUser } from 'src/common/decorators/auth.decorator';
// import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
// import { GetUploadedFilesQuery } from './dto/get-uploaded-files-query.dto';
// import { UploadedFilesDto } from './dto/uploaded-files.dto';
// import { ImageUploadService } from './file-upload.service';

// @ApiTags('upload')
// @Controller('upload')
// @ApiBearerAuth()
// export class ImageUploadController {
//   constructor(private readonly imageUploadService: ImageUploadService) {}

//   @ApiOkResponse({
//     description: 'Upload files to S3',
//     type: 'File uploaded successfully',
//   })
//   @Post()
//   @UseGuards(JwtAuthGuard)
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         comment: { type: 'string' },
//         outletId: { type: 'integer' },
//         file: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile2(
//     @UploadedFile('file') file: any,
//     @Res() response,
//     @AuthUser() userId: string,
//   ) {
//     if (!file) {
//       throw new BadRequestException('invalid file provided');
//     }
//     if (file.size > 209715200) {
//       throw new BadRequestException('File size too large');
//     }
//     const { buffer, originalname } = file;
//     return this.imageUploadService.uploadFile(
//       buffer,
//       originalname,
//       response,
//       userId,
//     );
//   }

//   @ApiOkResponse({
//     description: 'Get all uploaded files',
//     type: [UploadedFilesDto],
//   })
//   @Get('admin')
//   @UseGuards(JwtAuthGuard)
//   getUploadedFiles(
//     @Query() params: GetUploadedFilesQuery,
//     @AuthUser() userId: string,
//   ) {
//     console.log('userId', userId);
//     const { offset = 0, limit = 10 } = params;

//     return plainToClass(
//       UploadedFilesDto,
//       this.imageUploadService.getAllUploadedFiles(userId, offset, limit),
//     );
//   }

//   @ApiOkResponse({
//     description: 'Get all uploaded files',
//     type: [UploadedFilesDto],
//   })
//   @Get('my-uploads')
//   @UseGuards(JwtAuthGuard)
//   getMyUploadedFiles(
//     @Query() params: GetUploadedFilesQuery,
//     @AuthUser() userId: string,
//   ) {
//     const { offset = 0, limit = 10 } = params;

//     return plainToClass(
//       UploadedFilesDto,
//       this.imageUploadService.getMyUploadedFiles(userId, offset, limit),
//     );
//   }

//   @ApiOkResponse({
//     description: 'Mark a file as unsafe',
//   })
//   @ApiBearerAuth()
//   @Post('admin/mark-as-unsafe/:fileId')
//   @UseGuards(JwtAuthGuard)
//   async markFileAsUnsafe(
//     @Res() res,
//     @AuthUser() userId: string,
//     @Param('fileId') fileId: string,
//   ) {
//     await this.imageUploadService.markFileAsUnsafe(fileId, userId);
//     return res
//       .status(200)
//       .json({ message: 'File has been marked as unsafe and deleted' });
//   }
// }
