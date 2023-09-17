import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
    declarations: [
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent
    ]
})
export class SharedModule { }
