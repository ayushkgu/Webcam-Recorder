import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { WebcamModule } from 'ngx-webcam';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoRecorderComponent } from './video-recorder/video-recorder.component'; 

@NgModule({
  declarations: [
    AppComponent,
    VideoRecorderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    ToastModule,
    BrowserAnimationsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
