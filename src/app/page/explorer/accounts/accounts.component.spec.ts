import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountsComponent } from './accounts.component';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              pageSize: 100,
              pageNumber: 1,
              order: 'desc',
              orderBy: 'balance',
              mosaicId: '310378C18A140D1B',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
