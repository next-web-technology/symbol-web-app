import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface NavigationMenu {
  icon: string;
  name: string;
  link: string;
  expandable: boolean;
  level: number;
  isExpanded?: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'symbol-web-app';
  drawerMode$: BehaviorSubject<MatDrawerMode> = new BehaviorSubject(
    'side' as MatDrawerMode
  );
  drawerOpend$ = new BehaviorSubject(true);
  navigationMenuList: NavigationMenu[] = [
    {
      icon: 'home',
      name: 'Home',
      link: '/',
      expandable: false,
      level: 0,
    },
    {
      icon: 'search',
      name: 'Explorer',
      link: '/explorer',
      expandable: true,
      level: 0,
      isExpanded: true,
    },
    {
      icon: 'account_circle',
      name: 'Accounts',
      link: '/explorer/accounts',
      expandable: false,
      level: 1,
    },
    {
      icon: 'view_in_ar',
      name: 'Blocks',
      link: '/explorer/blocks',
      expandable: false,
      level: 1,
    },
    {
      icon: 'account_balance_wallet',
      name: 'Wallet',
      link: '/wallet',
      expandable: true,
      level: 0,
      isExpanded: true,
    },
    {
      icon: 'vpn_key',
      name: 'Import Wallet',
      link: '/wallet/import',
      expandable: false,
      level: 1,
    },
  ];
  treeControl = new FlatTreeControl<NavigationMenu>(
    (node) => node.level,
    (node) => node.expandable
  );
  dataSource = new ArrayDataSource(this.navigationMenuList);

  constructor(private router: Router, private ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.handleResizeWindow(window.innerWidth);
      });
    };
  }

  ngOnInit() {
    this.handleResizeWindow(window.innerWidth);
  }

  handleResizeWindow(width: number): void {
    if (width < 640) {
      this.drawerOpend$.next(false);
    } else {
      this.drawerOpend$.next(true);
    }
  }

  toggleSideNav() {
    this.drawerOpend$.next(!this.drawerOpend$.getValue());
  }

  hasChild = (_: number, node: NavigationMenu): boolean => node.expandable;

  getParentNode(node: NavigationMenu): NavigationMenu | null {
    const nodeIndex = this.navigationMenuList.indexOf(node);
    for (let index = nodeIndex - 1; index >= 0; index--) {
      if (this.navigationMenuList[index].level === node.level - 1) {
        return this.navigationMenuList[index];
      }
    }
    return null;
  }

  shouldRender(node: NavigationMenu): boolean {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }
}
