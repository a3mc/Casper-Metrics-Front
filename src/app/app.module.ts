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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from './services/data.service';
import { DistributionComponent } from './overview/distribution/distribution.component';
import { FooterComponent } from './footer/footer.component';
import { MarketComponent } from './market/market.component';
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
import { CirculatingComponent } from './circulating/circulating.component';
import { BlockComponent } from './block/block.component';
import { MarkdownModule } from 'ngx-markdown';
import { DocsComponent } from './docs/docs.component';
import { DelegatorsComponent } from './delegators/delegators.component';
import { StakeInfoComponent } from './stake-info/stake-info.component';
import { DelegatorsRewardsComponent } from './stake-info/delegators-rewards/delegators-rewards.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { InspectorComponent } from './inspector/inspector.component';

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
        MarketComponent,
        FlowComponent,
        TransfersFullComponent,
        StakeComponent,
        WeightsFullComponent,
        TrainComponent,
        EraProgressComponent,
        CirculatingComponent,
        BlockComponent,
        DocsComponent,
        DelegatorsComponent,
        StakeInfoComponent,
        DelegatorsRewardsComponent,
        SearchbarComponent,
        InspectorComponent,
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
        LeafletMarkerClusterModule,
        MarkdownModule.forRoot( { loader: HttpClient } ),
    ],
    providers: [
        ApiClientService,
        DataService
    ],
    bootstrap: [AppComponent],
} )
export class AppModule {
}
