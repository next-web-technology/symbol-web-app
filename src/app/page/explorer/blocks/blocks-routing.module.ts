import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockComponent } from './block/block.component';
import { BlocksComponent } from './blocks.component';

const routes: Routes = [
  {
    path: '',
    component: BlocksComponent,
  },
  {
    path: ':height',
    component: BlockComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksRoutingModule {}
