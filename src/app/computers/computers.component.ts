import { Component, OnInit } from '@angular/core';
import { ComputerService } from '../services/computer.service';
import { Computer, User } from '../models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-computers',
    templateUrl: './computers.component.html',
    styleUrls: ['./computers.component.scss']
})
export class ComputersComponent implements OnInit {
    private userSubscription: Subscription;
    user: User;
    computers: Computer[] = [];
    profiles = [];
    computerType = '';

    constructor(
        private router: Router,
        private computerService: ComputerService,
        private authService: AuthService,
    ) {
        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
                const wizardResult = JSON.parse(localStorage.getItem('wizard_answers'));
                if (!wizardResult || !wizardResult.answers) {
                    this.router.navigateByUrl('/wizard');
                    return;
                } else {
                    this.profiles = wizardResult.profiles;
                    this.computerType = wizardResult.computerType;
                    this.getComputersByWizardAnswers(wizardResult.answers);
                }
            }
        );
    }

    ngOnInit() {
    }

    private getComputersByWizardAnswers(answers: any) {
        this.computerService.searchBestComputersByFilters(answers).subscribe(
            (computers) => {
                if (this.user) {
                    // TODO save serach history
                }

                //localStorage.removeItem('wizard_answers');
                this.computers = computers;
            });
    }

    addComputerToFavourite(computerId) {
        if (this.user.favouriteComputers) {
            if (this.user.favouriteComputers.includes(computerId)) {
                if (this.user.favouriteComputers.indexOf(computerId) !== -1) {
                    this.user.favouriteComputers.splice(this.user.favouriteComputers.indexOf(computerId), 1);
                }
            } else {
                this.user.favouriteComputers.push(computerId);
            }
        }
    }
}
