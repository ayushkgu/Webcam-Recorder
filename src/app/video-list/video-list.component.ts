import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

/**
 * Component responsible for displaying a list of video links.
 * Provides functionality to toggle the visibility of the video list
 * and to refresh the list from Firebase.
 */
@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {
  videos: any[] = []; 
  showVideos: boolean = true; 

  // Inject FirebaseService for data fetching
  constructor(private firebaseService: FirebaseService) {}

  //  OnInit lifecycle hook to load the video links
  ngOnInit(): void {
    this.loadVideoLinks();
  }

  // Function to fetch video links from Firebase and update the 'videos' array
  loadVideoLinks(): void {
    this.firebaseService.getVideoLinks().subscribe({
      next: (videos) => {
        this.videos = videos; 
        console.log(this.videos);
      },
      error: (error) => console.error('Error fetching video links:', error), 
    });
  }

  // Function to toggle the display of the video list
  toggleVideos(): void {
    this.showVideos = !this.showVideos; 
    if (this.showVideos) {
      this.loadVideoLinks();
    }
  }

  // Fiunction to refresh the video list manually
  refreshVideos() {
    this.loadVideoLinks(); 
  }
}