
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import * as RecordRTC from 'recordrtc';
import { FirebaseService } from '../firebase.service';

/**
 * Component to handle video recording from a webcam and uploading it to Firebase.
 */
@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.component.html',
  styleUrls: ['./video-recorder.component.css'],
  providers: [MessageService]
})

export class VideoRecorderComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  recordRTC: any;
  isLoading = true;
  isRecording = false;
  isRecorded = false;
  recordingConfirmed = false;
  stream!: MediaStream;
  previewUrl: string | null = null;

  // Inject FirebaseService and MessageService via constructor
  constructor(private firebaseService: FirebaseService, private messageService: MessageService) {}

  // OnInit lifecycle hook to prefetch media stream
  ngOnInit() {
    this.prefetchMediaStream();
  }

  // Function to request user media and set up video element for stream playback
  async prefetchMediaStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
      this.videoElement.nativeElement.srcObject = this.stream;
  
      this.videoElement.nativeElement.muted = true;
  
      this.videoElement.nativeElement.play();
  
      this.isLoading = false; 
    } catch (error) {
      console.error('Error prefetching media stream:', error);
    
    }
  }
  
  // Function to begin recording the video from the webcam
  async startRecording() {
    this.isRecording = true;
    this.recordingConfirmed = false;
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.videoElement.nativeElement.srcObject = this.stream;
    this.videoElement.nativeElement.muted = true;
    this.videoElement.nativeElement.play();

    this.recordRTC = new RecordRTC(this.stream, {
      type: 'video',
      mimeType: 'video/webm'
    });

    this.recordRTC.startRecording();
  }

  // Function to stop recording and create a preview URL
  async stopRecording() {
    if (this.recordRTC) {
      await new Promise<void>((resolve) => {
        this.recordRTC.stopRecording(() => {
          this.isRecording = false;
          const recordedBlob = this.recordRTC.getBlob();
          this.previewUrl = URL.createObjectURL(recordedBlob);
          console.log("Preview URL" + this.previewUrl);

          this.stream.getTracks().forEach(track => track.stop());
          resolve();

          this.isRecorded = true;
        });
      });
    }
  }

  // Function to handle confirmation of recording and initiate upload
  confirmRecording() {
    this.uploadVideo();
  }

  // Function to redo the recording
  redoRecording() {
    this.recordingConfirmed = false;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.startRecording();
    this.isRecorded = false;
  }

  // Function to cancel the current recording
  cancelRecording() {
    this.isRecording = false;
    this.stream.getTracks().forEach(track => track.stop());
    this.isLoading = false;
    this.isRecorded = false;
    this.recordingConfirmed = false;
    this.previewUrl = null;
  }

  // Function to start over the recording process
  startOver() {
    this.recordingConfirmed = false;
    this.recordRTC = null;
    this.isLoading = true;
    this.isRecording = false;
    this.isRecorded = false;
    this.recordingConfirmed = false;
    this.previewUrl = null;

    this.startRecording();
  }

  // Functzon to upload the recorded video to Firebase and handle UI messages
  async uploadVideo() {
    try {    
      const recordedBlob = this.recordRTC.getBlob();
      console.log("Type is " + recordedBlob.type);
      const videoUrl = await this.firebaseService.uploadVideo(recordedBlob);
      console.log("Video URL" + videoUrl);

      this.firebaseService.saveVideoInfo(videoUrl);
      this.recordingConfirmed = true;

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Recording Uploaded Sucessfully' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Uploading Recording' });

    }

  }
}
