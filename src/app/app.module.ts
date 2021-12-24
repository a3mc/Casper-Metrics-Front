import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { InfoBarComponent } from './info-bar/info-bar.component';
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
import { TransfersComponent } from './overview/transfers/transfers.component';
import { MarketComponent } from './overview/market/market.component';
import { FlowComponent } from './overview/flow/flow.component';
import { FlowFullComponent } from './charts/flow-full/flow-full.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TransfersFullComponent } from './charts/transfers-full/transfers-full.component'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StakeComponent } from './charts/stake/stake.component';
import { WeightsFullComponent } from './charts/weights-full/weights-full.component';
import { MapFullComponent } from './charts/map-full/map-full.component';

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
        FooterComponent,
        TransfersComponent,
        MarketComponent,
        FlowComponent,
        FlowFullComponent,
        TransfersFullComponent,
        StakeComponent,
        WeightsFullComponent,
        MapFullComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        NgxEchartsModule.forRoot( {
            echarts: () => import('echarts'),
        } ),
        NgxSliderModule,
        FormsModule,
        CommonModule,
        CommonModule,
    ],
    providers: [
        ApiClientService,
        DataService
    ],
    bootstrap: [AppComponent],
} )
export class AppModule {
}
