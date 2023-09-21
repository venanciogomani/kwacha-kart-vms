import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
    declarations: [
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        ChatBotComponent,
        FloatingMenuComponent
    ],
    imports: [
        CommonModule,
        MatIconModule
    ],
    exports: [
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        ChatBotComponent,
        FloatingMenuComponent
    ]
})
export class SharedModule { }
