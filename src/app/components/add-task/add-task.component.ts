import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class AddTaskComponent  implements OnInit {

  public task: Task = {
    id: '',
    title: '',
    completed: false,
    categoryId: null,
  };
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  async addTask() {
    await this.taskService.addTask(this.task);
    this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
