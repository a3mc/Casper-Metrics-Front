import { AfterViewInit, Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { ApiClientService } from "../services/api-client.service";
import { take } from "rxjs";

@Component( {
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
} )
export class MapComponent implements AfterViewInit {

	@Input( 'mode' ) public mode: string = '';

	public showInfo = false;
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
	}

	private initMap(): void {
		this._map = L.map( 'map', {
			center: [38, 20],
			zoom: this.mode === 'full' ? 2 : 1,
			scrollWheelZoom: false,
		} );
		const tiles = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: this.mode === 'full' ? 5 : 3,
			minZoom: this.mode === 'full' ? 2 : 1,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		} );

		tiles.addTo( this._map );
		this._addMarkers();
	}

	private _addMarkers(): void {
		const markersData: any[] = [];
		this._apiClientService.get( 'geodata/validators' )
			.pipe( take( 1 ) )
			.subscribe(
				( result: any ) => {
					for ( const peer of result ) {
						if ( peer.loc ) {
							markersData.push( [
								parseFloat( peer.loc.split( ',' )[0] ),
								parseFloat( peer.loc.split( ',' )[1] )
							] );
						}
					}

					for ( const position of markersData ) {
						L.marker( position, {
							icon: L.divIcon( {
								className: 'validator-icon',
								iconSize: [8, 8],
							} ),
							riseOnHover: true
						}, ).addTo( this._map );
					}
				}
			);
	}
}
