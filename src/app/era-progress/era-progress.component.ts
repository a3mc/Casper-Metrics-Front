import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { Subject, takeUntil } from "rxjs";

@Component( {
    selector: 'app-era-progress',
    templateUrl: './era-progress.component.html',
    styleUrls: ['./era-progress.component.scss']
} )
export class EraProgressComponent implements OnInit, OnDestroy {

    private _destroySubject= new Subject<void>();
    public era: any = null;
    public eraBlocks = 0;

    constructor(
        public dataService: DataService
    ) {
    }

    ngOnInit(): void {
        this.dataService.lastEra$.pipe( takeUntil( this._destroySubject ) )
            .subscribe(
                result => {
                    if ( result ) {
                        this.era = result;
                        this.eraBlocks = this.era.endBlock - this.era.startBlock;
                    }
                }
            )
    }

    ngOnDestroy(): void  {
        this._destroySubject.next();
    }

}
