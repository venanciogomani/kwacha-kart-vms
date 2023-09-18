import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAnalyticsComponent } from './vendor-analytics.component';

describe('VendorAnalyticsComponent', () => {
  let component: VendorAnalyticsComponent;
  let fixture: ComponentFixture<VendorAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
