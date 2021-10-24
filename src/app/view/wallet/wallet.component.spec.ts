import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ViewWalletComponent } from './wallet.component';

describe('ViewWalletComponent', () => {
  let component: ViewWalletComponent;
  let fixture: ComponentFixture<ViewWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewWalletComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
