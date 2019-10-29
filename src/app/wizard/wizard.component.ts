import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    step: number = 1;
    allSteps: number = 4;
    computerType: String = '';
    chosenProfiles: String[] = [];

    types = [
        { image: 'notebook.png', name: 'Notebook' },
        { image: 'pc.png', name: 'PC' },
    ]

    profiles = [
        { image: 'design.png', name: 'Diseño', value: 'design' },
        { image: 'media.png', name: 'Multimedia', value: 'multimedia' },
        { image: 'arquitect.png', name: 'Aquitectura', value: 'arquitecture' },
        { image: 'administration.png', name: 'Administración', value: 'administration' },
        { image: 'gamer.png', name: 'Gamer', value: 'gamer' },
        { image: 'ocio.png', name: 'Ocio', value: 'leisure' },
    ]
    constructor() { }

    ngOnInit() {
    }

    progressValue(): Number {
        let result = Number((this.step/this.allSteps).toFixed(2)) * 100;
        return result;
    }

    chooseProfile(profile: String) {
        if(this.chosenProfiles.includes(profile)) {
            this.chosenProfiles = this.chosenProfiles.filter((item) => item !== profile);
        } else {
            this.chosenProfiles.push(profile);
        }
    }
}
