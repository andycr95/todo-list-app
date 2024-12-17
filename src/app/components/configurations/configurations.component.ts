import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ThemesComponent } from '../themes/themes.component';
import { ModalController } from '@ionic/angular';
import { ManageCategoriesComponent } from '../manage-categories/manage-categories.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppState } from 'src/app/app-state';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ConfigurationsComponent implements OnInit {
  paletteToggle: boolean = false;

  constructor(private modalController: ModalController, private appState: AppState) { }

  ngOnInit() { 
    this.paletteToggle = this.appState.getPaletteToggle();
  }

  async openThemesModal() {
    const modal = await this.modalController.create({
      component: ThemesComponent,
    });
    return await modal.present();
  }

  toggleChange(event: any) {
    this.appState.toggleChange(event.detail.checked);
  }

  async openCategoriesModal() {
    const modal = await this.modalController.create({
      component: ManageCategoriesComponent,
    });
    return await modal.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
