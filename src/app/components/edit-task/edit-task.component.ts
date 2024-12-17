import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class EditTaskComponent  implements OnInit {

  @Input() task!: Task;
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  async updateTask() {
    await this.taskService.updateTask(this.task);
    this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
