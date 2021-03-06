import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MediaQueryModule } from '@pevil/media-query';

import { DemoComponent } from './demo.component';

@NgModule({
    declarations: [DemoComponent],
    imports: [BrowserModule, MediaQueryModule],
    bootstrap: [DemoComponent]
})
export class DemoModule {}