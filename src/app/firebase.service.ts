// firebase.service.ts

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { getDatabase, ref, push } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.app);
  db = getDatabase(this.app);

  constructor() {}

  async uploadVideo(blob: Blob): Promise<string> {
    try {
      // Generate a unique file name for the video
      const uniqueIdentifier = `videos/${Date.now()}.webm`;
      const storageReference = storageRef(this.storage, uniqueIdentifier);

      // Optional: Define metadata for the video
      const metadata = {
        contentType: 'video/webm',
      };

      // Upload the video blob with metadata
      await uploadBytes(storageReference, blob, metadata);

      // Get and return the download URL for the uploaded video
      const downloadURL = await getDownloadURL(storageReference);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

   saveVideoInfo(URL: String): void {
      console.log(URL);
    try {
      // Define the video data object to be saved in the Realtime Database
      const videoData = {
        blobURL: URL,
        timestamp: Date.now(),
        title: "My Title"
      };

      // Reference to the 'videos' node in the database
      const videosRef = ref(this.db, 'videos');
      // Push the video data to create a new entry
      push(videosRef, videoData);
    } catch (error) {
      console.error('Error saving video information:', error);
      throw error;
    }

  }


}