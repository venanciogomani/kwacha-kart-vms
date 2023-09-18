import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMarketingComponent } from './vendor-marketing.component';

describe('VendorMarketingComponent', () => {
  let component: VendorMarketingComponent;
  let fixture: ComponentFixture<VendorMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMarketingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
