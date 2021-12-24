import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ChartsComponent } from './charts/charts.component';
import { ApiComponent } from './api/api.component';

const routes: Routes = [
    { path: '', component: OverviewComponent, pathMatch: 'full' },
    { path: 'charts', component: ChartsComponent },
    { path: 'api', component: ApiComponent },
];

@NgModule( {
    imports: [RouterModule.forRoot( routes, {
        initialNavigation: 'enabled',
        preloadingStrategy: PreloadAllModules,
    } )],
    exports: [RouterModule]
} )
export class AppRoutingModule {
}
