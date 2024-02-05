# WebcamRecorder

WebcamRecorder is an Angular-based application that allows users to record videos directly from their webcam, review their recording, and upon confirmation, upload the video to Firebase Storage. The application also saves the video's metadata, including its Firebase Storage URL, to the Firebase Realtime Database. This project is designed to showcase the integration of webcam video recording in a web application using the Angular framework and Firebase as the backend service.

## Features

- Video recording directly from the webcam.
- Review and redo the recording before confirmation.
- Upload the confirmed video to Firebase Storage.
- Save video metadata to Firebase Realtime Database.
- Simple and intuitive user interface.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed.
- Angular CLI installed.
- A Firebase project created and configured.

## Setup

To get a local copy up and running, follow these simple steps:

1. Clone the repository through terminal:
   git clone https://github.com/ayushkgu/Webcam-Recorder.git
   
2. Navigate to the project directory:
    cd WebcamRecorder

3. Install NPM packages:
    npm install

4. Start the application: 
    ng serve --o

## Usage
- Start Recording: Click on the "Start Recording" button to begin capturing video from your webcam.
- Stop Recording: Click "Stop Recording" once you're done. You'll then be able to review your video.
- Review and Confirm: After reviewing your recording, you can choose to confirm, redo, or cancel the recording.
- Video Upload: Upon confirmation, the video is uploaded to Firebase Storage, and its metadata is saved to the Firebase Realtime Database.

## Contact
Ayush Gupta - ayukgupta@gmail.com

Project Link: https://github.com/ayushkgu/Webcam-Recorder