import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowFullComponent } from './flow-full.component';

describe('FlowFullComponent', () => {
  let component: FlowFullComponent;
  let fixture: ComponentFixture<FlowFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
