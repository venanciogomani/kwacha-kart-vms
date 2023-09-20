import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { ErrorsModule } from './errors/errors.module';
import { StoreModule } from '@ngrx/store';
import { storesReducer } from 'src/state/reducers/stores.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PagesModule,
    ErrorsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      stores: storesReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
