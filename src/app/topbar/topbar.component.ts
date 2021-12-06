import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../services/api-client.service';
import { environment } from '../../environments/environment';

@Component( {
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
} )
export class TopbarComponent implements OnInit {

    public showNetworkDropdown = false;

    constructor(
        public apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
    }

    public changeNetwork( network: string ): void {
        if ( network === 'mainnet' ) {
            location.host = environment.frontMainnetHost;
        } else if ( network === 'testnet' ) {
            location.host = environment.frontTestnetHost;
        }
    }

}
