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
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Make sure this import is here
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  storage = getStorage(this.app);
  db = getDatabase(this.app);
  JSONURL = "https://webcam-recorder-82ff6-default-rtdb.firebaseio.com/videos.json";

  constructor(private http: HttpClient) {}

  getVideoLinks(): Observable<any[]> {
    return this.http.get<any>(this.JSONURL).pipe(
      map(response => {
        const videoArray = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            videoArray.push(response[key]);
          }
        }
        return videoArray;
      })
    );
  }

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
        timestamp: this.formatTimestamp(),
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


   formatTimestamp(): string {
    const now = new Date(); // Get the current date and time
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed in JS, add 1 to get the correct month
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString().substr(-2); // Get the last two digits of the year
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  }
  

}