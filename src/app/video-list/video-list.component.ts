import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {
  videos: any[] = [];
  showVideos: boolean = true; // Add this line

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadVideoLinks();
  }

  loadVideoLinks(): void {
    this.firebaseService.getVideoLinks().subscribe({ 
      next: (videos) => {
        this.videos = videos;
        console.log(this.videos);
      },
      error: (error) => console.error('Error fetching video links:', error),
    });
  }

  toggleVideos(): void { // Add this method
    this.showVideos = !this.showVideos;
    if (this.showVideos)
      this.loadVideoLinks();
  }

  refreshVideos(){
    this.loadVideoLinks();
  }
}
