import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePaymentMethodsComponent } from './store-payment-methods.component';

describe('StorePaymentMethodsComponent', () => {
  let component: StorePaymentMethodsComponent;
  let fixture: ComponentFixture<StorePaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorePaymentMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorePaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
