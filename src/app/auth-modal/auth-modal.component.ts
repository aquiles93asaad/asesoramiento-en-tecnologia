import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from '../models';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CustomValidators } from '../services/match-other.validator';
import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth-modal',
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {

    authForm: FormGroup;
    authType = '';
    header = '';
    submitBtnText = '';
    changeAuthLabel = '';
    changeAuthBtnLabel = '';
    isSubmitting = false;
    errorMessage = '';

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<AuthModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public initialAuthType: string
    ) {
        this.authType = initialAuthType;
        this.initAuthForm();
    }

    ngOnInit() { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // convenience getter for easy access to form fields
    get f() { return this.authForm.controls; }
    get passwords() {
        const passwords = this.authForm.get('passwords') as FormGroup;
        return passwords.controls;
    }

    submitForm() {
        if (this.authForm.valid) {
            this.isSubmitting = true;
            if (this.authType === 'register') {
                this.userService.check(this.authForm.get('email').value.toLowerCase()).pipe(
                    concatMap((userExists) => {
                        if (userExists) {
                            this.authForm.get('email').setErrors({ userExists: true });
                            return Observable.throw('');
                        }
                        // tslint:disable-next-line: prefer-const
                        let user = this.authForm.value;
                        user.password = user.passwords.password;
                        delete user.passwords;
                        return this.authService.register(user);
                    })
                ).subscribe(
                    data => {
                        this.showMessage('Bienvenido a CompuHelp.');
                        this.dialogRef.close();
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        this.isSubmitting = false;
                    }
                );
            } else {
                this.authService.login(this.authForm.get('email').value.toLowerCase(), this.authForm.get('password').value,
                    true)
                    .subscribe(
                        (user: User) => {
                            this.dialogRef.close();
                        },
                        (error) => {
                            if (error.error === 'invalid-user') {
                                this.authForm.get('username').setErrors({ invalidUser: true });
                                this.errorMessage = error.statusText;
                            }

                            if (error.error === 'invalid-password') {
                                this.authForm.get('password').setErrors({ invalidPassword: true });
                                this.errorMessage = error.statusText;
                            }
                            this.isSubmitting = false;
                        }
                    );
            }
        }
    }

    changeAuth() {
        this.authType = (this.authType === 'login') ? 'register' : 'login';
        this.initAuthForm();
    }

    private initAuthForm() {
        if (this.authType === 'register') {
            this.authForm = this.formBuilder.group({
                name: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                // passwords: this.formBuilder.group({
                //     password: ['', Validators.required],
                //     repeatPass: ['', Validators.required]
                // }, {
                //     validator: CustomValidators.Match('email', 'repeat')
                // }),
            });

            const passwordsForm = this.formBuilder.group({
                password: ['', Validators.required],
                repeat: ['', Validators.required]
            }, {
                validator: CustomValidators.Match('password', 'repeat')
            });

            this.authForm.addControl('passwords', passwordsForm);

            this.header = 'Crear una cuenta';
            this.submitBtnText = 'Crear cuenta';
            this.changeAuthLabel = '¿Ya tenes cuenta?';
            this.changeAuthBtnLabel = 'Ingresar';
        } else {
            this.authForm = this.formBuilder.group({
                email: ['', Validators.required],
                password: ['', Validators.required],
                rememberMe: [true]
            });

            this.header = 'Ingresá a tu cuenta';
            this.submitBtnText = 'Ingresar';
            this.changeAuthLabel = '¿Aún no tenes cuenta?';
            this.changeAuthBtnLabel = 'Registrar';
        }
    }

    private showMessage(message) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex', 'mb-3']
        });
    }
}
