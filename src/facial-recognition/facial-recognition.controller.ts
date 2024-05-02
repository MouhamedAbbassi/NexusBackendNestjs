//  // facial-recognition.controller.ts

//  import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
//  import { FacialRecognitionService } from './facial-recognition.service';

//  @Controller()
//  export class FacialRecognitionController {
//    constructor(private readonly facialRecognitionService: FacialRecognitionService) {}

//    @Post('recognize-face')
//    @UseInterceptors(FileInterceptor('image'))
//   recognizeFace(@UploadedFile() image: Express.Multer.File): string {
//      const result = this.facialRecognitionService.recognizeFace(image.buffer);
//     return result;
//   }
// }
