import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Computer } from '../models';
import { ComputerService } from '../services/computer.service';

@Component({
    selector: 'app-computer-detail',
    templateUrl: './computer-detail.component.html',
    styleUrls: ['../computers/computers.component.scss']
})
export class ComputerDetailComponent implements OnInit {

    computer: Computer = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private computerService: ComputerService
    ) {
        this.computerService.get(this.route.snapshot.params.id).subscribe(
            (computer: Computer) => {
                this.computer = computer;
            }
        );
    }

    ngOnInit() {
    }

}
