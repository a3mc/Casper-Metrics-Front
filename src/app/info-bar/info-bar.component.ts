import { Component } from '@angular/core';
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
