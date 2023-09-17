import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessUnavailableComponent } from './access-unavailable.component';

describe('AccessUnavailableComponent', () => {
  let component: AccessUnavailableComponent;
  let fixture: ComponentFixture<AccessUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessUnavailableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
