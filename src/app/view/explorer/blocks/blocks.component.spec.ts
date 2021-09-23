import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ViewBlocksComponent } from './blocks.component';

describe('BlocksComponent', () => {
  let component: ViewBlocksComponent;
  let fixture: ComponentFixture<ViewBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [ViewBlocksComponent],
      providers: [MatSnackBar],
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
