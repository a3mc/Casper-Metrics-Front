import { AfterViewInit, Component, Input, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs";
import 'leaflet.markercluster';

@Component( {
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class MapComponent implements AfterViewInit {

    @Input( 'mode' ) public mode: string = '';

    public showInfo = false;
    public validator: any = null;
    public showChartsLink = false;
    private _map: any;

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    public toggleInfo(): void {
        this.showInfo = !this.showInfo;
        this.validator = null;
    }

    private initMap(): void {
        this._map = L.map( 'map', {
            center: [38, 20],
            zoom: this.mode === 'full' ? 2 : 1,
            scrollWheelZoom: false,
            worldCopyJump: true,
        } );
        const tiles = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: this.mode === 'full' ? 50 : 3,
            minZoom: this.mode === 'full' ? 2 : 1,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        } );

        tiles.addTo( this._map );
        this._addMarkers();
    }

    private _addMarkers(): void {
        const markers = L.markerClusterGroup();

        const markersData: any[] = [];
        this._apiClientService.get( 'validators' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    for ( const peer of result ) {
                        if ( peer.loc ) {
                            markersData.push( peer );
                        }
                    }

                    for ( const validator of markersData ) {
                        const marker = L.marker( [
                            parseFloat( validator.loc.split( ',' )[0] ),
                            parseFloat( validator.loc.split( ',' )[1] )
                        ], {
                            icon: L.divIcon( {
                                className: 'validator-icon',
                                iconSize: [32, 32],
                            } ),
                            riseOnHover: true,
                        }, )
                            .bindTooltip( layer => validator.org )
                            .on( 'click', result => {
                                if ( this.mode !== 'full' ) {
                                    this.showChartsLink = true;
                                    return;
                                }
                                this.validator = validator;
                                this.showInfo = true;
                                return false;
                            } );

                        markers.addLayer( marker );
                    }
                    this._map.addLayer( markers );
                }
            );
    }
}
