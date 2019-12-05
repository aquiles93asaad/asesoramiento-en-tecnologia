import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-search-history',
    templateUrl: './search-history.component.html',
    styleUrls: ['./search-history.component.scss', '../computers/computers.component.scss']
})
export class SearchHistoryComponent implements OnInit {
    private userSubscription: Subscription;
    user: User;
    searchHistory: any;

    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        if ((window as any).user) {
            this.user = (window as any).user;
            this.getUserSearchHistory();
        }

        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
                if (this.user) {
                    this.getUserSearchHistory();
                }
            }
        );
    }

    private getUserSearchHistory() {
        this.userService.getUserSearchHistory().subscribe(
            (searchHistory) => {
                this.searchHistory = searchHistory;
                console.log(this.searchHistory);
            }
        );
    }
}
