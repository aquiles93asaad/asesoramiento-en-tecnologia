import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from '../services/user.service';
import { User } from '../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../services/match-other.validator';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-profile-modal',
    templateUrl: './profile-modal.component.html',
    styleUrls: ['../auth-modal/auth-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {
    profileForm: FormGroup;
    isSubmitting = false;
    typeFiles = ['jpeg', 'png'];
    private file: string;

    constructor(
        public dialogRef: MatDialogRef<ProfileModalComponent>,
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        @Optional() @Inject(MAT_DIALOG_DATA) public user: User
    ) {
        this.initForm();
    }

    ngOnInit() {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    submitForm() {
        if (this.user._id) {
            // tslint:disable-next-line: prefer-const
            this.isSubmitting = true;
            let user = this.profileForm.value;
            user._id = this.user._id;
            user.image = this.file;
            this.userService.update(user)
                .subscribe(
                    data => {
                        if (data) {
                            this.authService.setUser(data);
                            this.onNoClick();
                        }
                    },
                    error => {
                        console.log(error);
                        this.showMessage(error);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                );
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }

    getDocumentFile(event) {
        const stream = event.split(';base64,');
        return this.file = event;
    }

    private initForm() {
        this.profileForm = this.formBuilder.group({
            email: [{ value: this.user.email, disabled: true }],
            name: [this.user.name],
            lastName: [this.user.lastName],
        });

        const passwordsForm = this.formBuilder.group({
            password: [''],
            repeat: ['']
        }, {
            validator: CustomValidators.Match('password', 'repeat')
        });

        this.profileForm.addControl('passwords', passwordsForm);
    }
}
