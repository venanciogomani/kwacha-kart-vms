import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRevenueComponent } from './vendor-revenue.component';

describe('VendorRevenueComponent', () => {
  let component: VendorRevenueComponent;
  let fixture: ComponentFixture<VendorRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRevenueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
