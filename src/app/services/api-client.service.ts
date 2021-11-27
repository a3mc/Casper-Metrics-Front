import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders( { 'Content-Type': 'application/json' } )
};

@Injectable()
export class ApiClientService {
    public baseUrl = 'http://3.124.189.139:3001/';

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get( endpoint: string ): any {
        let url = this.baseUrl + endpoint;
        return this._httpClient.get( url );
    }

    public getUrl( url: string ): any {
        return this._httpClient.get( url );
    }

}
