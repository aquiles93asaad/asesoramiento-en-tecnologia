import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Computer } from '../models';
import { ComputerService } from '../services/computer.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';

@Component({
    selector: 'app-computer-detail',
    templateUrl: './computer-detail.component.html',
    styleUrls: ['../computers/computers.component.scss']
})
export class ComputerDetailComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    computer: Computer = null;
    processor: any;
    memory: any;
    graphics: any;
    battery: any;
    storage: any;
    connectivity: any;
    dimensions: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private computerService: ComputerService
    ) {
        this.computerService.get(this.route.snapshot.params.id).subscribe(
            (computer: Computer) => {
                this.computer = computer;
                this.processor = this.computer.specifications.processor;
                this.memory = this.computer.specifications.memory;
                this.graphics = this.computer.specifications.graphicsCard;
                this.battery = this.computer.specifications.battery;
                this.storage = this.computer.specifications.storage;
                this.connectivity = this.computer.specifications.connectivity;
                this.dimensions = this.computer.specifications.dimensions;
            }
        );
    }

    ngOnInit() {
        this.galleryOptions = [
            {
                width: '100%',
                height: '100%',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                // imagePercent: 100,
                imageSize: NgxGalleryImageSize.Contain,
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];
 
        this.galleryImages = [
            {
                small: 'assets/Lenovo.png',
                medium: 'assets/Lenovo.png',
                big: 'assets/Lenovo.png'
            },
            {
                small: 'assets/Lenovo.png',
                medium: 'assets/Lenovo.png',
                big: 'assets/Lenovo.png'
            },
            {
                small: 'assets/Lenovo.png',
                medium: 'assets/Lenovo.png',
                big: 'assets/Lenovo.png'
            },
            {
                small: 'assets/Lenovo.png',
                medium: 'assets/Lenovo.png',
                big: 'assets/Lenovo.png'
            }
        ];
    }

}
