import { ChangeDetectorRef, Directive, EmbeddedViewRef, Input, NgZone, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEventPattern';

@Directive({
    selector: '[ifMediaQuery]',
    exportAs: 'ifMediaQuery'
})
export class MediaQueryDirective implements OnDestroy {
    private mq: MediaQueryList;
    private changeSubscription: Subscription;
    private viewRef: EmbeddedViewRef<any>;

    constructor(
        private template: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private zone: NgZone,
        private cdr: ChangeDetectorRef) {
    }

    @Input()
    set ifMediaQuery(query: string) {
        if (this.mq) {
            this.cleanUp();
        }

        this.setup(query);
    }

    ngOnDestroy() {
        this.cleanUp();
    }

    private setup(query: string) {
        this.mq = window.matchMedia(query);

        this.changeSubscription = Observable.fromEventPattern(
            (handler: MediaQueryListListener) => this.mq.addListener(handler),
            (handler: MediaQueryListListener) => this.mq.removeListener(handler)
        ).subscribe(this.handleMediaQuery);
        this.onChanges(this.mq.matches);
    }

    private cleanUp() {
        this.changeSubscription.unsubscribe();
        this.mq = null;
    }

    private handleMediaQuery = (mq: MediaQueryList) => {
        this.zone.run(() => this.onChanges(mq.matches));
    }

    private onChanges = (matches: boolean) => {
        if (matches && !this.viewRef) {
            this.viewRef = this.viewContainerRef.createEmbeddedView(this.template);
        } else if (!matches && this.viewRef) {
            this.viewContainerRef.clear();
            this.viewRef.destroy();
            this.viewRef = undefined;
        }
        this.cdr.markForCheck();
    }
}
