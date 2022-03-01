import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";

@Component( {
    selector: 'app-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss']
} )
export class BlockComponent implements OnInit {

    constructor(
        public dataService: DataService,
    ) {
    }

    ngOnInit(): void {
    }

}
