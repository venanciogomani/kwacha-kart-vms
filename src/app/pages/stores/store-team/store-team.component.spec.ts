import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTeamComponent } from './store-team.component';

describe('StoreTeamComponent', () => {
  let component: StoreTeamComponent;
  let fixture: ComponentFixture<StoreTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
