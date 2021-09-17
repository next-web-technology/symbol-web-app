import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewExplorerComponent } from './explorer.component';

@NgModule({
  declarations: [ViewExplorerComponent],
  imports: [CommonModule],
  exports: [ViewExplorerComponent],
})
export class ViewExplorerModule {}
