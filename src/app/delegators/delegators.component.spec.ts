import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatorsComponent } from './delegators.component';

describe('DelegatorsComponent', () => {
  let component: DelegatorsComponent;
  let fixture: ComponentFixture<DelegatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
