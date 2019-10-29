import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WizardComponent } from './wizard/wizard.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WizardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatProgressBarModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
