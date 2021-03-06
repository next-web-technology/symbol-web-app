import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BlocksRoutingModule } from './blocks-routing.module';
import { BlocksComponent } from './blocks.component';
import { ViewBlocksModule } from 'src/app/view/explorer/blocks/blocks.module';
import { ViewBlockModule } from 'src/app/view/explorer/blocks/block/block.module';
import { BlockComponent } from './block/block.component';

@NgModule({
  declarations: [BlocksComponent, BlockComponent],
  imports: [
    CommonModule,
    RouterModule,
    BlocksRoutingModule,
    ViewBlocksModule,
    ViewBlockModule,
  ],
})
export class BlocksModule {}
