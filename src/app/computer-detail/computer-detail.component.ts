import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from './../models/user.model';
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
    galleryImages: NgxGalleryImage[] = [];
    computer: Computer = null;
    processor: any;
    memory: any;
    graphics: any;
    battery: any;
    storage: any;
    connectivity: any;
    dimensions: any;
    user: User;
    math = Math;
    stars = [1, 2, 3, 4, 5];
    opinionStars = [
        {index: 1, selected: false},
        {index: 2, selected: false},
        {index: 3, selected: false},
        {index: 4, selected: false},
        {index: 5, selected: false},
    ];
    opinion = {
        rating: null,
        comment: null,
        date: null,
        user: null,
    };

    private userSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private computerService: ComputerService,
        private authService: AuthService,
        private userService: UserService,
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
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < this.computer.images.length; i++) {
                    const galleryImage = {
                        small: this.computer.images[i],
                        medium: this.computer.images[i],
                        big: this.computer.images[i]
                    };
                    this.galleryImages.push(galleryImage);
                }
                this.processComputerPrices();
            }
        );

        if ((window as any).user) {
            this.user = (window as any).user;
        }

        this.userSubscription = this.authService.userSource.subscribe(
            (user) => {
                this.user = user;
                if (this.user) {
                }
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
    }

    setOpinionStars(rating) {
        this.opinion.rating = rating;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.opinionStars.length; i++) {
            this.opinionStars[i].selected = false;
        }
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i <= rating; i++) {
            this.opinionStars[i].selected = true;
        }
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

    sendComment() {
        if (this.opinion.comment && this.opinion.rating) {
            this.opinion.date = new Date();
            this.opinion.user = this.user._id;
            this.computerService.addComment(this.opinion, this.computer._id).subscribe(
                (result) => {
                    console.log(result);
                }
            )
        }
    }

    private processComputerPrices() {
        let bestPrice = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.computer.availableAt.length; j++) {
            if (bestPrice === 0) {
                bestPrice = this.computer.availableAt[j].price;
            } else {
                if (this.computer.availableAt[j].price !== 0 && this.computer.availableAt[j].price < bestPrice) {
                    bestPrice = this.computer.availableAt[j].price;
                }
            }
        }
        this.computer.price = bestPrice;
    }
}
