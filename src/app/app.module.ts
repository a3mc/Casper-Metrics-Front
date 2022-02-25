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
import { FlowComponent } from './flow/flow.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TransfersFullComponent } from './charts/transfers-full/transfers-full.component'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StakeComponent } from './charts/stake/stake.component';
import { WeightsFullComponent } from './charts/weights-full/weights-full.component';
import { ClipboardModule } from "ngx-clipboard";
import { TrainComponent } from './train/train.component';
import { EraProgressComponent } from './era-progress/era-progress.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

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
        TransfersFullComponent,
        StakeComponent,
        WeightsFullComponent,
        TrainComponent,
        EraProgressComponent,
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
        ClipboardModule,
        LeafletModule,
        LeafletMarkerClusterModule
    ],
    providers: [
        ApiClientService,
        DataService
    ],
    bootstrap: [AppComponent],
} )
export class AppModule {
}
