import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AppState {
    private renderer: Renderer2;
    private currentTheme: string | null = null;

  constructor(
    private rendererFactory: RendererFactory2,
    private storage: Storage
  ) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  async init() {
    await this.storage.create();
    this.currentTheme = await this.storage.get('selected-theme');      
    this.applyTheme(this.currentTheme!);
  }

  applyTheme(themeName: string) {
    this.renderer.removeClass(
      document.documentElement,
      this.currentTheme!
    );
    this.currentTheme = themeName;
    this.renderer.addClass(document.documentElement, themeName);
    this.storage.set('selected-theme', themeName);
  }

  getCurrentTheme(): string | null {
    return this.currentTheme;
  }
}