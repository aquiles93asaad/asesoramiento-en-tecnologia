import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class Helpers {

    constructor(
        private snackBar: MatSnackBar,
    ) { }

    public openErrorSnackBar(message: string, duration = 4000) {
        this.snackBar.open(message, '', {
            duration,
            panelClass: ['danger-snackbar'],
        });
    }

    public openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 4000,
            panelClass: ['accent-snackbar'],
        });
    }
}