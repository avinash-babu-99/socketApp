import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrientRequestsComponent } from './frient-requests.component';

describe('FrientRequestsComponent', () => {
  let component: FrientRequestsComponent;
  let fixture: ComponentFixture<FrientRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrientRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrientRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
