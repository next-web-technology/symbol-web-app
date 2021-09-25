import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface importedWallet {
  name: string;
  address: string;
  privateKey: string;
  password: string;
}

@Component({
  selector: 'app-view-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ViewImportComponent implements OnInit {
  isPasswordVisible = false;

  @Input() name?: string | null;
  @Input() address?: string | null;
  @Input() privateKey?: string | null;
  @Input() password?: string | null;
  @Input() isLoading?: boolean | null;
  @Input() isFormDisabled?: boolean | null;

  @Output() importWallet = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    console.log('ngOnInit ViewImportComponent');
  }

  onTogglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onImportWallet(
    name: string,
    address: string,
    privateKey: string,
    password: string
  ): void {
    console.log('setWallet');
    this.importWallet.emit({
      name,
      address,
      privateKey,
      password,
    });
  }
}
