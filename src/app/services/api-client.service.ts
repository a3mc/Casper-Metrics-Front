import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders( { 'Content-Type': 'application/json' } )
};

@Injectable()
export class ApiClientService {
    public network = location.host.indexOf( 'testnet' ) > -1 ? 'testnet' : 'mainnet';
    public baseUrl = this.network === 'testnet' ? environment.apiTestnetUrl: environment.apiMainnetUrl;

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get( endpoint: string ): any {
        let url = this.baseUrl + endpoint;
        return this._httpClient.get( url );
    }

    public getUrl( url: string ): any {
        return this._httpClient.get( url, httpOptions );
    }

}
