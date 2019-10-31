import { Component, OnInit } from '@angular/core';
import { UsageProfileService } from './../services/usage-profile.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';

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
    questionsForm: FormGroup;
    private profilesObject = {};

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

    ngOnInit() { }

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
                this.createQuestionsForm();
            }
        }
    }

    private createQuestionsForm() {
        this.questionsForm = this.formBuilder.group({});
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.chosenProfiles.length; i++) {
            const profileQuestionsGroup = this.formBuilder.group({})
            const questions = this.profilesObject[this.chosenProfiles[i]].questions;
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < questions.length; j++) {
                profileQuestionsGroup.addControl(this.chosenProfiles[i] + '_question_' + j, new FormControl(''));
            }
            this.questionsForm.addControl(this.chosenProfiles[i], profileQuestionsGroup);
        }
        console.log(this.questionsForm);
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
}
