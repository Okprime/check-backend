// import {
//   applyDecorators,
//   CallHandler,
//   createParamDecorator,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
// import { Observable } from 'rxjs';
// import { JwtAuthGuard } from '../guards/jwt.guard';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
// @Injectable()
// class FileExtender implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest();
//     console.log('req', req);
//     req.body['name'] = req.body.name;
//     req.body['address'] = req.body.address;
//     req.body['city'] = req.body.city;
//     req.body['managerEmail'] = req.body.managerEmail;
//     req.body['noOfTables'] = Number(req.body.noOfTables);
//     return next.handle();
//   }
// }

// export const thss = () => {
//   return applyDecorators(
//     ApiConsumes('multipart/form-data'),
//     ApiBody({
//       schema: {
//         type: 'object',
//         properties: {
//           name: { type: 'string' },
//           address: { type: 'string' },
//           city: { type: 'string' },
//           managerEmail: { type: 'string' },
//           noOfTables: { type: 'integer' },
//           file: {
//             type: 'string',
//             format: 'binary',
//           },
//         },
//       },
//     }),
//     // UseInterceptors(FileExtender),
//     UseInterceptors(FileInterceptor('file')),
//   );
// };
