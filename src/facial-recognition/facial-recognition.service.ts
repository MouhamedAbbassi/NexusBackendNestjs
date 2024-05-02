// // // facial-recognition.service.ts

//  import { Injectable } from '@nestjs/common';
//  import * as cv from 'opencv4nodejs';

//  @Injectable()
//  export class FacialRecognitionService {
//    recognizeFace(image: Buffer): string {
//     // Load the cascade for face detection
//     const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// //     // Read the image
//     const img = cv.imdecode(image);

// //     // Convert the image to gray scale for face detection
//     const grayImg = img.cvtColor(cv.COLOR_BGR2GRAY);

// //     // Detect faces in the image
//      const faceRects = faceClassifier.detectMultiScale(grayImg).objects;

//     if (faceRects.length === 0) {
//      return "No face detected";
//    } else {
//      return "Face detected";
//    }
//  }
//  }
