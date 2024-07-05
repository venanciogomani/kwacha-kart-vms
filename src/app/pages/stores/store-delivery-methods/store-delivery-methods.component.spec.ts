import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDeliveryMethodsComponent } from './store-delivery-methods.component';

describe('StoreDeliveryMethodsComponent', () => {
  let component: StoreDeliveryMethodsComponent;
  let fixture: ComponentFixture<StoreDeliveryMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDeliveryMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDeliveryMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
