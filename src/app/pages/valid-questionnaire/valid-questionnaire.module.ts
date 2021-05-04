import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ValidQuestionnairePage } from './valid-questionnaire.page';

import { ComponentsModule } from 'src/app/components/components.module';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

const routes: Routes = [
  {
    path: '',
    component: ValidQuestionnairePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ValidQuestionnairePage]
})
export class ValidQuestionnairePageModule {}
