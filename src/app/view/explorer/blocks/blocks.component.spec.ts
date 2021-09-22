import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlocksComponent } from './blocks.component';

describe('BlocksComponent', () => {
  let component: ViewBlocksComponent;
  let fixture: ComponentFixture<ViewBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBlocksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
