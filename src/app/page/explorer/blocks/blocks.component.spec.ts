import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BlockService } from 'src/app/model/block/block.service';

import { BlocksComponent } from './blocks.component';

describe('BlocksComponent', () => {
  let component: BlocksComponent;
  let fixture: ComponentFixture<BlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlocksComponent],
      imports: [RouterTestingModule, OverlayModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              pageSize: 10,
              pageNumber: 1,
              order: 'descending',
              orderBy: 'height',
            }),
          },
        },
        MatSnackBar,
        BlockService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
