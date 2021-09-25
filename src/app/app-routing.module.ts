import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./page/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'explorer',
    loadChildren: () =>
      import('./page/explorer/explorer.module').then((m) => m.ExplorerModule),
  },
  {
    path: 'wallet',
    loadChildren: () =>
      import('./page/wallet/wallet.module').then((m) => m.WalletModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
