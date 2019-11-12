import { Component, OnInit } from '@angular/core';
import { UsageProfileService } from '../services/usage-profile.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, FormArray } from '@angular/forms';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    step = 1;
    allSteps = 3;
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
                // this.profilesObject[this.profiles[i].name].questionsAnswersObject = {};
                // const questions = this.profiles[i].questions;
                // for (let j = 0; j < questions.length; j++) {
                //     this.profilesObject[this.profiles[i].name].questionsAnswersObject[this.profiles[i].name + '_question_' + j] = {};
                //     const answers = questions[j].answers;
                //     // tslint:disable-next-line: prefer-for-of
                //     for (let k = 0; k < answers.length; k++) {
                //         // tslint:disable-next-line: max-line-length
                // tslint:disable-next-line: max-line-length
                //         this.profilesObject[this.profiles[i].name].questionsAnswersObject[this.profiles[i].name + '_question_' + j][answers[k]._id] = answers[k];
                //     }
                // }
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

        this.allSteps = 2 + this.chosenProfiles.length;
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
            const answers = [];
            const profiles = [];
            for (const profile in this.questionsForm.value) {
                if (this.questionsForm.value.hasOwnProperty(profile)) {
                    const formGroup = this.questionsForm.value[profile];
                    profiles.push(this.profilesObject[profile].label);
                    for (const question in formGroup) {
                        if (formGroup.hasOwnProperty(question) && question !== '') {
                            const questionSplit = question.split('_');
                            if (formGroup[question].length  ) {
                                // tslint:disable-next-line: prefer-for-of
                                for (let i = 0; i < formGroup[question].length; i++) {
                                    answers.push(this.profilesObject[profile].questions[questionSplit[2]].answers[formGroup[question][i]]);
                                }
                            } else {
                                answers.push(this.profilesObject[profile].questions[questionSplit[2]].answers[formGroup[question]]);
                            }
                            // answers.push(this.profilesObject[profile].questionsAnswersObject[question][formGroup[question]]);
                        }
                    }
                }
            }
            const completedWizard = {
                computerType: this.computerType,
                profiles,
                answers
            };
            localStorage.setItem('wizard_answers', JSON.stringify(completedWizard));
            this.router.navigateByUrl('/computers');
        } else {
            this.step = this.step + 1;
            if (this.step === 3) {
                this.questionsForm = this.formBuilder.group({});
                this.createFormGroups();
            }
        }
    }

    get f() { return this.questionsForm.controls; }

    // returns all form groups under profileQuestions
    get profileQuestionsGroup() {
        return this.questionsForm.get('profileQuestions') as FormArray;
    }

    private createFormGroups() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.chosenProfiles.length; i++) {
            this.questionsForm.addControl(this.chosenProfiles[i], this.getUsageProfileFormGroup(this.chosenProfiles[i]));
        }
    }

    private getUsageProfileFormGroup(profile: string) {
        const form = this.formBuilder.group({});
        const questions = this.profilesObject[profile].questions;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < questions.length; i++) {
            form.addControl(profile + '_question_' + i, new FormControl(''));
        }

        return form;
    }

    // getGroupControlsAsArray(control: AbstractControl): any[] {
    //     const form = control as FormGroup;
    //     const controls = [];
    //     for (const key in form.controls) {
    //         if (form.controls.hasOwnProperty(key)) {
    //             // tslint:disable-next-line: no-shadowed-variable
    //             const control = { name: key, profileName: key.split('_')[0], control: form.controls[key] as FormControl};
    //             controls.push(control);
    //         }
    //     }
    //     return controls;
    // }
}
