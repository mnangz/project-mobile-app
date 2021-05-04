import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, 
  LoadingController,
  Platform} from '@ionic/angular';

@Component({
  selector: 'app-all-questionnaires',
  templateUrl: './all-questionnaires.page.html',
  styleUrls: ['./all-questionnaires.page.scss'],
})
export class AllQuestionnairesPage implements OnInit {

  constructor(public navCtrl: NavController,) { }

  ngOnInit() {
  }

  start() {
    this.navCtrl.navigateRoot('/questionnaire');
  }

}
