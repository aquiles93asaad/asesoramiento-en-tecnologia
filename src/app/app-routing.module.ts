import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WizardComponent } from './wizard/wizard.component';
import { ComputersComponent } from './computers/computers.component';

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
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
