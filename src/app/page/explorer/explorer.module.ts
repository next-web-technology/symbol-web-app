import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerComponent } from './explorer.component';
import { ViewExplorerModule } from 'src/app/view/explorer/explorer.module';

@NgModule({
  declarations: [ExplorerComponent],
  imports: [CommonModule, ExplorerRoutingModule, ViewExplorerModule],
})
export class ExplorerModule {}
