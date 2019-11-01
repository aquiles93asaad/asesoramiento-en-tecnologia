import { Component, OnInit } from '@angular/core';
import { UsageProfileService } from './../services/usage-profile.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, FormArray } from '@angular/forms';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    step = 1;
    allSteps = 4;
    computerType = '';
    chosenProfiles: string[] = [];
    profiles: any[] = [];
    questionsGroups = {};
    profilesObject = {};
    profilesQuestions: FormArray;
    questionsForm: FormGroup;

    types = [
        { image: 'notebook.png', name: 'Notebook' },
        { image: 'pc.png', name: 'PC' },
    ];
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private usageProfileService: UsageProfileService
    ) {
        this.usageProfileService.search().subscribe((profiles) => {
            this.profiles = profiles;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.profiles.length; i++) {
                this.profilesObject[this.profiles[i].name] = this.profiles[i];
            }
        });
    }

    ngOnInit() {
    }

    progressValue(): number {
        const result = Number((this.step / this.allSteps).toFixed(2)) * 100;
        return result;
    }

    chooseProfile(profile: string) {
        if (this.chosenProfiles.includes(profile)) {
            this.chosenProfiles = this.chosenProfiles.filter((item) => item !== profile);
        } else {
            this.chosenProfiles.push(profile);
        }
    }

    goBack() {
        if (this.step === 1) {
            this.router.navigateByUrl('/');
        } else {
            this.step = this.step - 1;
        }
    }

    goForward() {
        if (this.step === this.allSteps) {
            this.router.navigateByUrl('/computers');
        } else {
            this.step = this.step + 1;
            if (this.step === 3) {
                this.profilesQuestions = this.formBuilder.array([]);
                this.questionsForm = this.formBuilder.group({
                    profileQuestions: this.formBuilder.array(this.createQuestionsForm())
                });
                this.profilesQuestions = this.questionsForm.get('profileQuestions') as FormArray;
            }
        }
    }

    get f() { return this.questionsForm.controls; }

    // returns all form groups under profileQuestions
    get profileQuestionsGroup() {
        return this.questionsForm.get('profileQuestions') as FormArray;
    }

    getGroupControlsAsArray(control: AbstractControl): any[] {
        console.log(control);
        const form = control as FormGroup;
        const controls = [];
        for (const key in form.controls) {
            if (form.controls.hasOwnProperty(key)) {
                // tslint:disable-next-line: no-shadowed-variable
                const control = { name: key, profileName: key.split('_')[0], control: form.controls[key] as FormControl};
                controls.push(control);
            }
        }
        return controls;
    }

    private createQuestionsForm(): FormGroup[] {
        const result: FormGroup[] = [];
        // this.questionsForm = ;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.chosenProfiles.length; i++) {
            this.questionsGroups[this.chosenProfiles[i]] = this.formBuilder.group({});
            const profileQuestionsGroup = this.formBuilder.group({});
            const questions = this.profilesObject[this.chosenProfiles[i]].questions;
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < questions.length; j++) {
                profileQuestionsGroup.addControl(this.chosenProfiles[i] + '_question_' + j, new FormControl(''));
            }
            result.push(profileQuestionsGroup);
            this.profilesQuestions.push(profileQuestionsGroup);
            //this.questionsForm.addControl(this.chosenProfiles[i], profileQuestionsGroup);
        }
        return result;
    }

    getName(control: AbstractControl): string | null {
        const group = control.parent as FormGroup;

        if (!group) {
            return null;
        }

        let name: string;

        Object.keys(group.controls).forEach(key => {
            const childControl = group.get(key);

            if (childControl !== control) {
                return;
            }

            name = key;
        });

        return name;
    }

    // getFormGroup(name: string): FormGroup {
    //     const group = this.questionsForm.get(name) as FormGroup;
    //     return group;
    // }

    getControlsAsArray(controls) {
        let result = [];
        // tslint:disable-next-line: forin
        for (const key in controls) {
            if (controls.hasOwnProperty(key)) {
                const item = {
                    name: key,
                    control: controls[key]
                };
                result.push(item);
            }
        }
        return result;
    }
}
