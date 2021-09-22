import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { BlocksComponent } from './blocks.component';
import { ViewBlocksModule } from 'src/app/view/explorer/blocks/blocks.module';

@NgModule({
  declarations: [BlocksComponent],
  imports: [CommonModule, BlocksRoutingModule, ViewBlocksModule],
})
export class BlocksModule {}
