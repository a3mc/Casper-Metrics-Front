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
    public eraBlocksEstimated = 0; // Estimated average of blocks based on the last era.

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
                        this.eraBlocksEstimated = this.era.endBlock - this.era.startBlock;
                    }
                }
            )
    }

    ngOnDestroy(): void  {
        this._destroySubject.next();
    }

    public eraPercentage(): number {
        if ( !this.era || !this.dataService.lastBlock ) return 0;

        return Math.min( 100, Math.round(
            ( this.dataService.lastBlock.blockHeight - this.era.endBlock ) / this.eraBlocksEstimated * 100
        ) );
    }

}
