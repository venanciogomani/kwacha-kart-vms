import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import { ToasterComponent } from './toaster/toaster.component';



@NgModule({
    declarations: [
        SidebarComponent,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        ChatBotComponent,
        FloatingMenuComponent,
        ToasterComponent
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
        FloatingMenuComponent,
        ToasterComponent
    ]
})
export class SharedModule { }
