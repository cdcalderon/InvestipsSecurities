import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalFilterComponent } from './signal-filter.component';

describe('SignalFilterComponent', () => {
  let component: SignalFilterComponent;
  let fixture: ComponentFixture<SignalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
