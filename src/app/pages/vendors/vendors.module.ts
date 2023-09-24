import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { VendorCustomersComponent } from './vendor-customers/vendor-customers.component';
import { VendorChatComponent } from './vendor-chat/vendor-chat.component';
import { VendorDealsComponent } from './vendor-deals/vendor-deals.component';
import { VendorMarketingComponent } from './vendor-marketing/vendor-marketing.component';
import { VendorAnalyticsComponent } from './vendor-analytics/vendor-analytics.component';
import { VendorRevenueComponent } from './vendor-revenue/vendor-revenue.component';
import { VendorStatusComponent } from './vendor-status/vendor-status.component';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings.component';
import { VendorsComponent } from './vendors.component';
import { VendorTransactionsComponent } from './vendor-transactions/vendor-transactions.component';
import { VendorViewOrderComponent } from './vendor-view-order/vendor-view-order.component';
import { VendorViewTransactionComponent } from './vendor-view-transaction/vendor-view-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    VendorsComponent,
    ViewVendorComponent,
    VendorOrdersComponent,
    VendorCustomersComponent,
    VendorChatComponent,
    VendorDealsComponent,
    VendorMarketingComponent,
    VendorAnalyticsComponent,
    VendorRevenueComponent,
    VendorStatusComponent,
    VendorSettingsComponent,
    VendorTransactionsComponent,
    VendorViewOrderComponent,
    VendorViewTransactionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSlideToggleModule,
    SharedModule
  ],
  exports: [
    VendorsComponent,
    ViewVendorComponent,
    VendorOrdersComponent,
    VendorCustomersComponent,
    VendorChatComponent,
    VendorDealsComponent,
    VendorMarketingComponent,
    VendorAnalyticsComponent,
    VendorRevenueComponent,
    VendorStatusComponent,
    VendorSettingsComponent,
    VendorTransactionsComponent,
    VendorViewOrderComponent,
    VendorViewTransactionComponent
  ]
})
export class VendorsModule { }
