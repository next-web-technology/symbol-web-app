import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImportComponent } from './import.component';

@NgModule({
  declarations: [ViewImportComponent],
  imports: [CommonModule],
  exports: [ViewImportComponent],
})
export class ViewImportModule {}
