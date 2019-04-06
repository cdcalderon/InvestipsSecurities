import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullStoch307Component } from './bull-stoch307.component';

describe('BullStoch307Component', () => {
  let component: BullStoch307Component;
  let fixture: ComponentFixture<BullStoch307Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullStoch307Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullStoch307Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
