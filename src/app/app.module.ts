import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { WebcamModule } from 'ngx-webcam';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoRecorderComponent } from './video-recorder/video-recorder.component';
import { VideoListComponent } from './video-list/video-list.component'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    AppComponent,
    VideoRecorderComponent,
    VideoListComponent,
    VideoListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ToastModule,
    TableModule,
    BrowserAnimationsModule,
    HttpClientModule

  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
