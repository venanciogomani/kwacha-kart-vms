import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePaymentCenterComponent } from './store-payment-center.component';

describe('StorePaymentCenterComponent', () => {
  let component: StorePaymentCenterComponent;
  let fixture: ComponentFixture<StorePaymentCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorePaymentCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorePaymentCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
