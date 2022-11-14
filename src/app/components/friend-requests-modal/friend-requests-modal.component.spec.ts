import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestsModalComponent } from './friend-requests-modal.component';

describe('FriendRequestsModalComponent', () => {
  let component: FriendRequestsModalComponent;
  let fixture: ComponentFixture<FriendRequestsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendRequestsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
