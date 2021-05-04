import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopmenuComponent } from './popmenu/popmenu.component';

@NgModule({
  declarations: [PopmenuComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [PopmenuComponent]
})
export class ComponentsModule { }
