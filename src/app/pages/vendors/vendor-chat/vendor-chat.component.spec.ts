import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorChatComponent } from './vendor-chat.component';

describe('VendorChatComponent', () => {
  let component: VendorChatComponent;
  let fixture: ComponentFixture<VendorChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
