import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";

@Component( {
    selector: 'app-train',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.scss']
} )
export class TrainComponent implements OnInit {

    constructor(
        public dataService: DataService
    ) {
    }

    ngOnInit(): void {
    }

}
