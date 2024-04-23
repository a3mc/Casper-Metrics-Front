import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ChartsComponent } from './charts/charts.component';
import { ApiComponent } from './api/api.component';
import { DocsComponent } from './docs/docs.component';
import { StakeInfoComponent } from './stake-info/stake-info.component';
import { InspectorComponent } from "./inspector/inspector.component";

const routes: Routes = [
	{ path: '', component: OverviewComponent, pathMatch: 'full' },
	{ path: 'charts', component: ChartsComponent },
	{ path: 'accounting', component: StakeInfoComponent },
	{ path: 'api', component: ApiComponent },
	{ path: 'docs', component: DocsComponent },
	{ path: 'search', component: InspectorComponent },
];

@NgModule( {
	imports: [RouterModule.forRoot( routes, {
		initialNavigation: 'enabled',
		preloadingStrategy: PreloadAllModules,
		anchorScrolling: 'enabled',
		scrollPositionRestoration: 'enabled',
		scrollOffset: [0, 20],
	} )],
	exports: [RouterModule]
} )
export class AppRoutingModule {
}
