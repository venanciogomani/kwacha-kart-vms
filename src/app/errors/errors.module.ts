import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccessUnavailableComponent } from './access-unavailable/access-unavailable.component';



@NgModule({
    declarations: [
        NotFoundComponent,
        AccessUnavailableComponent,
        AccessUnavailableComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NotFoundComponent,
        AccessUnavailableComponent,
        AccessUnavailableComponent
    ]
})
export class ErrorsModule { }
