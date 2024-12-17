import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ModalController,
  PopoverController
} from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { AddTaskComponent } from '../components/add-task/add-task.component';
import { EditTaskComponent } from '../components/edit-task/edit-task.component';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { RemoteConfigService } from '../services/remote-config.service';
import { AppState } from '../app-state';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';

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
  selectedPriority: string | null = null;

  constructor(private taskService: TaskService,
    private modalController: ModalController,
    private categoryService: CategoryService,
    private remoteConfigService: RemoteConfigService,
    private popoverController: PopoverController,
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

  async openConfigurationsModal() {
    const modal = await this.modalController.create({
      component: ConfigurationsComponent,
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
    if (this.selectedPriority) {
      this.filteredTasks = this.filteredTasks.filter(
        (task) => task.priority === this.selectedPriority
      );
    }
  }

  sortTasks(criteria: string) {
    if (criteria === 'priority') {
      this.filteredTasks.sort((a, b) => {
        const priorityOrder = ['high', 'medium', 'low'];
        return (
          priorityOrder.indexOf(a.priority || '') -
          priorityOrder.indexOf(b.priority || '')
        );
      });
    } else if (criteria === 'title') {
      this.filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    this.popoverController.dismiss();
  }

  getCategoryName(categoryId: any): string {
    if (categoryId == null) return 'Sin categoría';
    return this.categories.find(c => c.id === categoryId)?.name || 'Sin categoría';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'orange';
        case 'low':
            return 'green';
      default:
        return 'black';
    }
  }

    async sortPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: 'ion-popover',
      event: ev,
      translucent: true,
      componentProps: {
        options: [
          { label: 'Prioridad', value: 'priority' },
          { label: 'Título', value: 'title' },
        ],
      },
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      this.sortTasks(data);
    }
  }

}
