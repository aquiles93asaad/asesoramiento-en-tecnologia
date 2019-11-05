import { Component, OnInit } from '@angular/core';
import { ComputerService } from '../services/computer.service';

@Component({
    selector: 'app-computers',
    templateUrl: './computers.component.html',
    styleUrls: ['./computers.component.scss']
})
export class ComputersComponent implements OnInit {

    computers: any[] = [];
    profiles = ['Diseño', 'Ocio']

    constructor(
        private computerService: ComputerService
    ) {
        this.computerService.search().subscribe((computers) => {
            console.log(computers);
            this.computers = computers;
        });
    }

    ngOnInit() {
    }

}
