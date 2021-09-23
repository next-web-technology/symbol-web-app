import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlockComponent } from './block.component';

describe('BlockComponent', () => {
  let component: ViewBlockComponent;
  let fixture: ComponentFixture<ViewBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBlockComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
