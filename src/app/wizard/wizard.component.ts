import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

    step = 1;
    computerType = '';
    profileChosen = '';

    types = [
        {image: 'notebook.png', name: 'Notebook'},
        {image: 'pc.png', name: 'PC'},
    ]

    profiles = [
        {image: 'design.png', name: 'Diseño'},
        {image: 'media.png', name: 'Multimedia'},
        {image: 'arquitect.png', name: 'Aquitectura'},
        {image: 'administration.png', name: 'Administración'},
        {image: 'gamer.png', name: 'Gamer'},
        {image: 'ocio.png', name: 'Ocio'},
    ]
    constructor() { }

    ngOnInit() {
    }

    chooseType(type) {
        this.computerType = type;
        this.step = 2;
    }

    chooseProfile(profile) {
        this.profileChosen = profile;
    }    
}
