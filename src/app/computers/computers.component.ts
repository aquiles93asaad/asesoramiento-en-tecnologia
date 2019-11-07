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
    profiles = ['Diseño', 'Ocio'];

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
}
