import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDealsComponent } from './vendor-deals.component';

describe('VendorDealsComponent', () => {
  let component: VendorDealsComponent;
  let fixture: ComponentFixture<VendorDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorDealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
