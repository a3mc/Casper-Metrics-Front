import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../services/api-client.service';
import { take } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component( {
    selector: 'app-info-bar',
    templateUrl: './info-bar.component.html',
    styleUrls: ['./info-bar.component.scss']
} )
export class InfoBarComponent {

    constructor(
        public dataService: DataService,
    ) {
    }
}
