import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExplorerComponent } from './explorer.component';

describe('ViewExplorerComponent', () => {
  let component: ViewExplorerComponent;
  let fixture: ComponentFixture<ViewExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewExplorerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
