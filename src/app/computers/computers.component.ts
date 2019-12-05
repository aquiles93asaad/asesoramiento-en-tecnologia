import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ComputerService } from '../services/computer.service';
import { Computer, User } from '../models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Helpers } from '../services/helpers.service';

@Component({
    selector: 'app-computers',
    templateUrl: './computers.component.html',
    styleUrls: ['./computers.component.scss']
})
export class ComputersComponent implements OnInit {
    private userSubscription: Subscription;
    private originalComputers: Computer[] = [];
    user: User;
    computers: Computer[] = [];
    profiles = [];
    computerType = '';
    brands: string[] = [];
    filters = {
        profiles: [],
        minPrice: null,
        maxPrice: null
    };

    constructor(
        private router: Router,
        private computerService: ComputerService,
        private authService: AuthService,
        private userService: UserService,
        private helpers: Helpers,
    ) {
    }

    ngOnInit() {
        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
            }
        );

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

    addComputerToFavourite(computerId) {
        let adding = true;
        if (this.user.favouriteComputers && this.user.favouriteComputers.includes(computerId)) {
            if (this.user.favouriteComputers.indexOf(computerId) !== -1) {
                this.user.favouriteComputers.splice(this.user.favouriteComputers.indexOf(computerId), 1);
            }
            adding = false;
        } else {
            if (!this.user.favouriteComputers) {
                this.user.favouriteComputers = [];
            }
            this.user.favouriteComputers.push(computerId);
        }

        this.userService.addComputerToFavourites(this.user.favouriteComputers).subscribe(
            (user) => {
                this.user = user;
                // tslint:disable-next-line: max-line-length
                this.helpers.openSnackBar((adding) ? 'La computadora se agregó a su lista de favoritos' : 'La computadora se quitó de su lista de favoritos');
            });
    }

    brandFilter(event) {
        if (typeof event !== 'undefined' && event !== null) {
            if (event.checked) {
                this.filters.profiles.push(event.source.value);
            } else {
                this.filters.profiles.splice(this.filters.profiles.indexOf(event.source.value), 1);
            }
        }
        this.filterComputers();
    }

    filterComputers() {
        const result: Computer[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.originalComputers.length; i++) {
            let addComputer = true;
            if (this.filters.profiles.length !== 0) {
                if (!this.filters.profiles.includes(this.originalComputers[i].brand)) {
                    addComputer = false;
                }
            }

            if (this.filters.minPrice) {
                if (this.filters.minPrice > this.originalComputers[i].price) {
                    addComputer = false;
                }
            }

            if (this.filters.maxPrice) {
                if (this.filters.maxPrice < this.originalComputers[i].price) {
                    addComputer = false;
                }
            }

            if (addComputer) {
                result.push(this.originalComputers[i]);
            }
        }
        this.computers = result;
    }

    private getComputersByWizardAnswers(answers: any) {
        const usageProfiles = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.profiles.length; i++) {
            usageProfiles.push(this.profiles[i]._id);
        }

        const params = {
            answers,
            usageProfiles,
            type: this.computerType,
            isNewSearch: false,
            userId: (this.user) ? this.user._id : null
        };
        const newWizardSearch = JSON.parse(localStorage.getItem('new_wizard_search'));
        if (this.user) {
            params.isNewSearch = (newWizardSearch === 'true') ? true : false;
        }

        this.computerService.searchBestComputersByFilters(params).subscribe(
            (computers) => {
                localStorage.setItem('new_wizard_search', JSON.stringify(false));
                this.computers = computers;
                this.originalComputers = computers;
                this.processComputers();
            });
    }

    private processComputers() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.computers.length; i++) {
            const computer = this.computers[i];
            let bestPrice = 0;
            if (!this.brands.includes(this.computers[i].brand)) {
                this.brands.push(this.computers[i].brand);
            }
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
