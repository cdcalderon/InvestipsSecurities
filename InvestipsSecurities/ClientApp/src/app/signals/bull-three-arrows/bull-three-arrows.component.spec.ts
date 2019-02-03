import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullThreeArrowsComponent } from './bull-three-arrows.component';

describe('BullThreeArrowsComponent', () => {
  let component: BullThreeArrowsComponent;
  let fixture: ComponentFixture<BullThreeArrowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullThreeArrowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullThreeArrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
