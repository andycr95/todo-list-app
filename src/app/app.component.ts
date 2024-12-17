import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AppState } from './app-state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private selectedTheme: string = 'blue-theme';

  constructor(private appState: AppState) { }

 async ngOnInit() {
    await this.appState.init();
    this.selectedTheme = this.appState.getCurrentTheme() || 'blue-theme';
  }

  onThemeChange() {
    this.appState.applyTheme(this.selectedTheme);
  }

}
