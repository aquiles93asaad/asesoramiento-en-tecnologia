import { UserService } from './../services/user.service';
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
        private userService: UserService
    ) {
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

    ngOnInit() {
        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
            }
        );
    }

    private getComputersByWizardAnswers(answers: any) {
        this.computerService.searchBestComputersByFilters(answers).subscribe(
            (computers) => {
                if (this.user) {
                    // TODO save serach history
                }

                //localStorage.removeItem('wizard_answers');
                this.computers = computers;
                this.processComputersPrices();
            });
    }

    addComputerToFavourite(computerId) {
        if (this.user.favouriteComputers && this.user.favouriteComputers.includes(computerId)) {
            if (this.user.favouriteComputers.indexOf(computerId) !== -1) {
                this.user.favouriteComputers.splice(this.user.favouriteComputers.indexOf(computerId), 1);
            }
        } else {
            if (!this.user.favouriteComputers) {
                this.user.favouriteComputers = [];
            }
            this.user.favouriteComputers.push(computerId);
        }

        this.userService.addComputerToFavourites(this.user.favouriteComputers).subscribe(
            (user) => {
                this.user = user;
            });
    }

    private processComputersPrices() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.computers.length; i++) {
            const computer = this.computers[i];
            let bestPrice = 0;
            // tslint:disable-next-line: prefer-for-of
            for (let j = 0; j < computer.availableAt.length; j++) {
                if (bestPrice === 0) {
                    bestPrice = computer.availableAt[j].price;
                } else {
                    if (computer.availableAt[j].price !== 0 && computer.availableAt[j].price < bestPrice) {
                        bestPrice = computer.availableAt[j].price;
                    }
                }
            }
            computer.price = bestPrice;
        }
    }
}
