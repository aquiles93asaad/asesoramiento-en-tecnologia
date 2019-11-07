import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { Subscription } from 'rxjs';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    private userSubscription: Subscription;
    user: User;

    constructor(
        public router: Router,
        public dialog: MatDialog,
        private authService: AuthService,
    ) {
        // init this.user on startup
        this.authService.me().subscribe(data => {
            this.user = data.user;
        });

        this.userSubscription = this.authService.userSource.subscribe(
            (user) => { this.user = user; }
        );
    }

    openAuthModal(type: string) {
        const dialogRef = this.dialog.open(AuthModalComponent, {
            width: (window.innerWidth < 992) ? '80%' : '40%',
            height: '90%',
            data: type,
            panelClass: ['custom-dialog']
        });
        dialogRef.afterClosed().subscribe(
            result => {
                console.log(result);
        });
    }

    profile() {
        const dialogRef = this.dialog.open(ProfileModalComponent, {
            width: '90%',
            height: '90%',
            data: this.user,
            panelClass: ['custom-dialog']
        });
        dialogRef.afterClosed().subscribe(result => {
            if (typeof result !== 'undefined') {
                this.user.name = result.name;
                this.user.lastName = result.lastName;
                this.user.email = result.email;
            }
        });
    }

    logout(): void {
        this.authService.signOut();
    }
}
