import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ApiClientService } from '../services/api-client.service';
import { environment } from '../../environments/environment';

@Component( {
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
} )
export class TopbarComponent implements OnInit {

    @ViewChild( 'network' ) network: ElementRef | undefined;

    public showNetworkDropdown = false;
    public showMenu = false;

    constructor(
        public apiClientService: ApiClientService
    ) {
    }

    @HostListener( 'document:mousedown', ['$event'] )
    onGlobalClick( event: MouseEvent ): void {
        if( this.network && !this.network.nativeElement.contains( event.target ) ) {
            this.showNetworkDropdown = false;
        }
    }

    ngOnInit(): void {
    }

    public setMenu( show = !this.showMenu ): void {
        this.showMenu = show;
        document.body.classList.toggle( 'no-scroll', this.showMenu );
    }

    public changeNetwork( network: string ): void {
        if ( network === 'mainnet' ) {
            location.host = environment.frontMainnetHost;
        } else if ( network === 'testnet' ) {
            location.host = environment.frontTestnetHost;
        }
    }

}
