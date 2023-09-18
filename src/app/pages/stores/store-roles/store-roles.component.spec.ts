import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRolesComponent } from './store-roles.component';

describe('StoreRolesComponent', () => {
  let component: StoreRolesComponent;
  let fixture: ComponentFixture<StoreRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
