import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerComponent } from './explorer.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorerComponent,
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/accounts.module').then((m) => m.AccountsModule),
  },
  {
    path: 'blocks',
    loadChildren: () =>
      import('./blocks/blocks.module').then((m) => m.BlocksModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorerRoutingModule {}
