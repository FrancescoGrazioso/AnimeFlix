import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPlayerComponent } from './load-player.component';

describe('LoadPlayerComponent', () => {
  let component: LoadPlayerComponent;
  let fixture: ComponentFixture<LoadPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
