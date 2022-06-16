import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component( {
    selector: 'app-docs',
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.scss'],
    encapsulation: ViewEncapsulation.None,
} )
export class DocsComponent implements OnInit {

    public errorLoading = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}
