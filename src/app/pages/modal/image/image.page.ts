import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  @Input() value: any;
  public info: any;
  personInfo: any;

  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.info = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.personInfo = JSON.parse(this.info.changingThisBreaksApplicationSecurity);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
