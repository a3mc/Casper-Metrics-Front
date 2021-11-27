import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerBarComponent } from './swagger-bar.component';

describe('SwaggerBarComponent', () => {
  let component: SwaggerBarComponent;
  let fixture: ComponentFixture<SwaggerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwaggerBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaggerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
