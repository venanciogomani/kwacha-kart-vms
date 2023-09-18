import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePlansComponent } from './store-plans.component';

describe('StorePlansComponent', () => {
  let component: StorePlansComponent;
  let fixture: ComponentFixture<StorePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorePlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
