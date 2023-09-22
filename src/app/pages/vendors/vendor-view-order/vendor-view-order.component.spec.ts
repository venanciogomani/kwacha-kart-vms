import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorViewOrderComponent } from './vendor-view-order.component';

describe('VendorViewOrderComponent', () => {
  let component: VendorViewOrderComponent;
  let fixture: ComponentFixture<VendorViewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorViewOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorViewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
