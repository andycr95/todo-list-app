import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { EditTaskComponent } from '../components/edit-task/edit-task.component';
import { ManageCategoriesComponent } from '../components/manage-categories/manage-categories.component';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { RemoteConfigService } from '../services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  editTaskFeatureFlag: boolean = false;
  deleteTaskFeatureFlag: boolean = false;

  constructor(private taskService: TaskService,
    private modalController: ModalController,
    private categoryService: CategoryService,
    private remoteConfigService: RemoteConfigService,
    private cdr: ChangeDetectorRef) { }
  
  
  async ngOnInit(): Promise<void> {
    this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.categories = await this.categoryService.getCategories();
    this.editTaskFeatureFlag = await this.remoteConfigService.getFeatureBooleanFlag('edit_task');
    this.deleteTaskFeatureFlag = await this.remoteConfigService.getFeatureBooleanFlag('delete_task');
    this.filteredTasks = [...this.tasks];
    this.cdr.detectChanges();
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
    if (this.editTaskFeatureFlag) {
      const modal = await this.modalController.create({
        component: EditTaskComponent,
        componentProps: { task },
      });
      modal.onDidDismiss().then(() => {
        this.loadTasks();
      });
      return await modal.present();
    }
  }

  async openManageCategoriesModal() {
    const modal = await this.modalController.create({
      component: ManageCategoriesComponent,
    });
    modal.onDidDismiss().then(() => {
      this.loadTasks();
    });
    return await modal.present();
  }

  async completeTask(task: Task) {
    if (this.editTaskFeatureFlag) {
      await this.taskService.updateTask(task);
    }
  }

  async deleteTask(task: Task) {
    if (this.deleteTaskFeatureFlag) {
      await this.taskService.deleteTask(task.id);
      this.loadTasks();
    } else {
      alert('La funcionalidad de eliminar tareas no está disponible en este momento.');
    }
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

  getCategoryName(categoryId: any): string {
    if (categoryId == null) return 'Sin categoría';
    return this.categories.find(c => c.id === categoryId)?.name || 'Sin categoría';
  }

}
