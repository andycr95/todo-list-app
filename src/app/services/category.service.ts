import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Category } from '../models/category.model';
import { generateId } from 'src/utils/generateIDs';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _storage: Storage | null = null;
  private categoriesKey = 'categories';

  private taskService: TaskService;

  constructor(private storage: Storage) {
    this.init();
    this.taskService = new TaskService(storage);
   }

   async init() {
    const storage = await this.storage.create();
    this._storage = storage;
   }
  
  // Create initial categories
  async createInitialCategories(): Promise<void> {
    const categories: Category[] = [
      { id: generateId(), name: 'Personal' },
      { id: generateId(), name: 'Trabajo' },
      { id: generateId(), name: 'Estudio' },
      { id: generateId(), name: 'Salud' },
    ];
    await this._storage?.set(this.categoriesKey, categories);
  }
  
  // Get all categories
  async getCategories(): Promise<Category[]> {
    return await this._storage?.get(this.categoriesKey) || [];
  }

  // Add a category
  async addCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    category.id = generateId();
    categories.push(category);
    await this._storage?.set(this.categoriesKey, categories);
  }

  // Update a category
  async updateCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      await this._storage?.set(this.categoriesKey, categories);
    }
  }

  // Delete a category
  async deleteCategory(categoryId: string): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index !== -1) {
      categories.splice(index, 1);
      await this._storage?.set(this.categoriesKey, categories);
    }
    const tasks = await this.taskService.getTasks();
    const updatedTasks = tasks.map(task => {
      if (task.categoryId === categoryId) {
        return { ...task, categoryId: null };
      }
      return task;
    });
    await this._storage?.set(this.taskService.tasksKey, updatedTasks);
  }
}
