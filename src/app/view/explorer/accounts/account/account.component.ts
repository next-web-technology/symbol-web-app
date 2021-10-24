import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';
import { Account } from 'src/app/model/account/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mosaic } from 'src/app/model/mosaic/mosaic.model';

@Component({
  selector: 'app-view-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class ViewAccountComponent {
  mosaicsDisplayedColumns: string[] = ['icon', 'relativeAmount', 'name', 'id'];

  @Input() account$?: Observable<Account | undefined>;
  @Input() mosaics$?: Observable<Mosaic[] | undefined>;

  constructor(private clipboard: Clipboard, private snackBar: MatSnackBar) {}

  copyClipboard(name: string, value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open(`${name} Copied!`, undefined, {
        duration: 3000,
      });
    }
  }
}
