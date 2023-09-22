import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorViewTransactionComponent } from './vendor-view-transaction.component';

describe('VendorViewTransactionComponent', () => {
  let component: VendorViewTransactionComponent;
  let fixture: ComponentFixture<VendorViewTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorViewTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorViewTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
