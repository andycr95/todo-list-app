import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { id: '', name: '' };
  editingCategory: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async addCategory() {
    if (this.editingCategory) {
      // Actualizar categoría existente
      await this.categoryService.updateCategory(this.editingCategory);
      this.editingCategory = null;
    } else {
      // Agregar nueva categoría
      await this.categoryService.addCategory(this.newCategory);
    }
    this.newCategory = { id: '', name: '' };
    await this.loadCategories();
  }

  editCategory(category: Category) {
    this.editingCategory = { ...category };
    this.newCategory = { ...category };
  }

  async deleteCategory(category: Category) {
    await this.categoryService.deleteCategory(category.id);
    await this.loadCategories();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}