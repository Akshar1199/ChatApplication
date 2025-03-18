import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateChatsComponent } from './private-chats.component';

describe('PrivateChatsComponent', () => {
  let component: PrivateChatsComponent;
  let fixture: ComponentFixture<PrivateChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateChatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
