import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../services/user.service';
import { User } from '../models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../services/match-other.validator';
import { AuthService } from '../services/auth.service';
import { Helpers } from '../services/helpers.service';

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
        private formBuilder: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private helpers: Helpers,
        @Optional() @Inject(MAT_DIALOG_DATA) public user: User
    ) {
        this.initForm();
    }

    ngOnInit() {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    // convenience getter for easy access to form fields
    get f() { return this.profileForm.controls; }
    get passwords() {
        const passwords = this.profileForm.get('passwords') as FormGroup;
        return passwords.controls;
    }

    submitForm() {
        if (this.user._id) {
            // tslint:disable-next-line: prefer-const
            this.isSubmitting = true;
            const user = this.profileForm.value;
            user._id = this.user._id;
            user.image = this.file;
            this.userService.update(user)
                .subscribe(
                    data => {
                        if (data) {
                            this.authService.setUser(data);
                            this.helpers.openSnackBar('Su perfil se actualizó correctamente!');
                            this.onNoClick();
                        }
                    },
                    error => {
                        console.log(error);
                        this.helpers.openErrorSnackBar(error);
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

    getDocumentFile(event) {
        const stream = event.split(';base64,');
        return this.file = event;
    }

    private initForm() {
        this.profileForm = this.formBuilder.group({
            email: [{ value: this.user.email, disabled: true }],
            name: [this.user.name],
            lastName: [this.user.lastName],
            oldPassword: ['']
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
