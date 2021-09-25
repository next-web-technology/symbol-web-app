import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewImportComponent } from './import.component';
import { ViewMaterialModule } from '../../material.module';

@NgModule({
  declarations: [ViewImportComponent],
  imports: [CommonModule, FormsModule, ViewMaterialModule],
  exports: [ViewImportComponent],
})
export class ViewImportModule {}
