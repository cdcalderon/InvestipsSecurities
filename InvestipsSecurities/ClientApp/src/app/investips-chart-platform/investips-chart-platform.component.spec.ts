import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestipsChartPlatformComponent } from './investips-chart-platform.component';

describe('InvestipsChartPlatformComponent', () => {
  let component: InvestipsChartPlatformComponent;
  let fixture: ComponentFixture<InvestipsChartPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestipsChartPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestipsChartPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
