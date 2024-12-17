import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { EditTaskComponent } from '../components/edit-task/edit-task.component';
import { ManageCategoriesComponent } from '../components/manage-categories/manage-categories.component';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public categories: Category[] = [];
  public selectedCategoryId: string | null = null;

  constructor(private taskService: TaskService,private modalController: ModalController, private categoryService: CategoryService) {}

  async ngOnInit(): Promise<void> {
    this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.categories = await this.categoryService.getCategories();
    console.log(this.tasks);
    
    this.filteredTasks = [...this.tasks];
  }

  async openAddTaskModal() {
    const modal = await this.modalController.create({
      component: AddTaskComponent,
    });
    modal.onDidDismiss().then(() => {
      this.loadTasks();
    });
    return await modal.present();
  }

  async openEditTaskModal(task: Task) {
    const modal = await this.modalController.create({
      component: EditTaskComponent,
      componentProps: { task },
    });
    modal.onDidDismiss().then(() => {
      this.loadTasks();
    });
    return await modal.present();
  }

  async openManageCategoriesModal() {
    const modal = await this.modalController.create({
      component: ManageCategoriesComponent,
    });
    return await modal.present();
  }

  async completeTask(task: Task) {
    console.log(task);
    await this.taskService.updateTask(task);
  }

  async deleteTask(task: Task) {
    await this.taskService.deleteTask(task.id);
    this.loadTasks();
  }

  filterTasks() {
    if (this.selectedCategoryId) {
      this.filteredTasks = this.tasks.filter(
        (task) => task.categoryId === this.selectedCategoryId
      );
    } else {
      this.filteredTasks = [...this.tasks];
    }
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || 'Sin categoría';
  }
}
