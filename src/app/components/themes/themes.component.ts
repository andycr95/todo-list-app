import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app-state';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ThemesComponent  implements OnInit {

  selectedTheme: string | null = null;
  themes: string[] = ['blue-theme', 'yellow-theme', 'green-theme', 'red-theme'];

  constructor(private appState: AppState,
    private modalController: ModalController, private cdr: ChangeDetectorRef) { }

  
  async ngOnInit() {
    await this.appState.init().then(() => {
      this.selectedTheme = this.appState.getCurrentTheme() || 'blue-theme';
      this.cdr.detectChanges();
    });
  }

  onThemeChange() {
    this.appState.applyTheme(this.selectedTheme!);
    this.cdr.detectChanges();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
