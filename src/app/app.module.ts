import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { InfoBarComponent } from './overview/info-bar/info-bar.component';
import { MapComponent } from './map/map.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { OverviewComponent } from './overview/overview.component';
import { ChartsComponent } from './charts/charts.component';
import { ApiComponent } from './api/api.component';
import { StackedComponent } from './stacked/stacked.component';
import { RewardsComponent } from './rewards/rewards.component';
import { ApiClientService } from './services/api-client.service';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { DistributionComponent } from './overview/distribution/distribution.component';
import { FooterComponent } from './footer/footer.component';

@NgModule( {
    declarations: [
        AppComponent,
        TopbarComponent,
        InfoBarComponent,
        MapComponent,
        OverviewComponent,
        ChartsComponent,
        ApiComponent,
        StackedComponent,
        RewardsComponent,
        DistributionComponent,
        FooterComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        NgxEchartsModule.forRoot( {
            /**
             * This will import all modules from echarts.
             * If you only need custom modules,
             * please refer to [Custom Build] section.
             */
            echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
        } ),
    ],
    providers: [
        ApiClientService,
        DataService
    ],
    bootstrap: [AppComponent]
} )
export class AppModule {
}
