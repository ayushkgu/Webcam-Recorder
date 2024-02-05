
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import * as RecordRTC from 'recordrtc';
import { FirebaseService } from '../firebase.service';

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

  constructor(private firebaseService: FirebaseService, private messageService: MessageService) {}

  ngOnInit() {
    // Prefetch the media stream
    this.prefetchMediaStream();
  }

  async prefetchMediaStream() {
    try {
      // Request access to the user's webcam and microphone
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
      this.videoElement.nativeElement.srcObject = this.stream;
  
      this.videoElement.nativeElement.muted = true;
  
      this.videoElement.nativeElement.play();
  
      this.isLoading = false; // Update the loading state
    } catch (error) {
      console.error('Error prefetching media stream:', error);
      // Handle errors, such as the user denying camera access
    }
  }
  

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

  async stopRecording() {
    if (this.recordRTC) {
      await new Promise<void>((resolve) => {
        this.recordRTC.stopRecording(() => {
          this.isRecording = false;
          const recordedBlob = this.recordRTC.getBlob();
          // Create a URL for the Blob and set it for preview
          this.previewUrl = URL.createObjectURL(recordedBlob);
          console.log("Preview URL" + this.previewUrl);

          // Stop all media tracks
          this.stream.getTracks().forEach(track => track.stop());
          resolve();

          this.isRecorded = true;
        });
      });
    }
  }


  confirmRecording() {
    this.uploadVideo();
  }


  redoRecording() {
    this.recordingConfirmed = false;
    // Revoke the object URL to release memory
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.startRecording();
    this.isRecorded = false;
  }

  cancelRecording() {
    this.isRecording = false;
    // Release the media stream
    this.stream.getTracks().forEach(track => track.stop());
    this.isLoading = false;
    this.isRecorded = false;
    this.recordingConfirmed = false;
    this.previewUrl = null;
  }

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
