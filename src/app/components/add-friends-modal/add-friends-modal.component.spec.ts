import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendsModalComponent } from './add-friends-modal.component';

describe('AddFriendsModalComponent', () => {
  let component: AddFriendsModalComponent;
  let fixture: ComponentFixture<AddFriendsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFriendsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
