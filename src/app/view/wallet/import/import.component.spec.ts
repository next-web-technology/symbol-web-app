import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ViewImportComponent } from './import.component';

describe('ViewImportComponent', () => {
  let component: ViewImportComponent;
  let fixture: ComponentFixture<ViewImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewImportComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
