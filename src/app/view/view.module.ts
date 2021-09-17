import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewHomeModule } from './home/home.module';
import { ViewExplorerModule } from './explorer/explorer.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ViewHomeModule, ViewExplorerModule],
})
export class ViewModule {}
