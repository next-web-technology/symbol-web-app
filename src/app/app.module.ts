import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewMaterialModule } from './view/material.module';

import { PageModule } from './page/page.module';
import { ViewModule } from './view/view.module';
import { PartModule } from './part/part.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ViewMaterialModule,
    PageModule,
    ViewModule,
    PartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
