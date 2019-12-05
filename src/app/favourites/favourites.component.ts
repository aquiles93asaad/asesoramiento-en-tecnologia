import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ComputerService } from '../services/computer.service';
import { Computer, User } from '../models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Helpers } from '../services/helpers.service';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.component.html',
    styleUrls: ['../computers/computers.component.scss']
})
export class FavouritesComponent implements OnInit {
    private userSubscription: Subscription;
    user: User;
    computers: Computer[] = [];

    constructor(
        private router: Router,
        private computerService: ComputerService,
        private authService: AuthService,
        private userService: UserService,
        private helpers: Helpers
    ) { }

    ngOnInit() {
        if ((window as any).user) {
            this.user = (window as any).user;
            this.getFavouritesComputers(this.user.favouriteComputers);
        }

        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
                if (this.user) {
                    this.getFavouritesComputers(this.user.favouriteComputers);
                }
            }
        );
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

    private getFavouritesComputers(ids) {
        const filters = {
            _id : { $in: ids }
        };

        this.computerService.search(filters).subscribe(
            (computers) => {
                this.computers = computers;
                this.processComputersPrices();
            }
        );
    }
}
