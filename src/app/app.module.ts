import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

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
        MatButtonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
