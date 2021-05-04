import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisitorSignOutPage } from './visitor-sign-out.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxSpinnerModule } from "ngx-spinner";

const routes: Routes = [
  {
    path: '',
    component: VisitorSignOutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisitorSignOutPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VisitorSignOutPageModule {}
