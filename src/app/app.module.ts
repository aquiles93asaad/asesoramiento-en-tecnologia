import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxGalleryModule } from 'ngx-gallery';

import {
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule
} from '@angular/material';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxFileDropModule } from 'ngx-file-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WizardComponent } from './wizard/wizard.component';
import { ComputersComponent } from './computers/computers.component';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { AuthHeaderInterceptor } from './services/header.interceptor';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { ComputerDetailComponent } from './computer-detail/computer-detail.component';
import { FavouritesComponent } from './favourites/favourites.component';

export class CustomHammerConfig extends HammerGestureConfig  {
    overrides = {
        pinch: { enable: false },
        rotate: { enable: false }
    };
 }

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WizardComponent,
        ComputersComponent,
        AuthModalComponent,
        DragAndDropComponent,
        ProfileModalComponent,
        ComputerDetailComponent,
        FavouritesComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        MatButtonModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatInputModule,
        MatMenuModule,
        ImageCropperModule,
        NgxFileDropModule,
        NgxGalleryModule,
        MatCheckboxModule,
        MatIconModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHeaderInterceptor,
            multi: true,
        },
        { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AuthModalComponent,
        ProfileModalComponent
    ]
})
export class AppModule { }
