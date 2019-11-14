import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WizardComponent } from './wizard/wizard.component';
import { ComputersComponent } from './computers/computers.component';
import { ComputerDetailComponent } from './computer-detail/computer-detail.component';
import { FavouritesComponent } from './favourites/favourites.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'wizard',
        component: WizardComponent
    },
    {
        path: 'computers',
        component: ComputersComponent
    },
    {
        path: 'computer/:id',
        component: ComputerDetailComponent
    },
    {
        path: 'favourites',
        component: FavouritesComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
