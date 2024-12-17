import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { subTask } from 'src/app/models/subTask.model';
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { EmojiPipe } from 'src/app/pipes/emoji.pipe';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, CommonModule, PickerComponent, EmojiPipe],
})
export class AddTaskComponent  implements OnInit {

  public toggled = false;
  public isSubTask = false;
  public newTask = {
    title: '',
    completed: false,
    emoji: null,
    categoryId: null,
    taskId: '',
  };

  @Input() taskId!: string;
  categories: Category[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const task = await this.taskService.getTask(this.taskId);
    if (task) { 
      this.isSubTask = true;
    }
    this.categories = await this.categoryService.getCategories();
    this.cdr.detectChanges();
  }

  async addTask() {
    if (this.isSubTask) {
      this.newTask.taskId = this.taskId;
      const subTask: subTask = {
        id: '',
        title: this.newTask.title,
        completed: false,
        taskId: this.taskId,
        emoji: this.newTask.emoji,
      };
      await this.taskService.addSubTask(subTask);
    } else {
      const task: Task = {
        id: '',
        title: this.newTask.title,
        completed: false,
        categoryId: this.newTask.categoryId,
        emoji: this.newTask.emoji,
      };
      await this.taskService.addTask(task);
    }
    this.modalController.dismiss();
  }

  handleSelection(event: any) {
    this.newTask.emoji = event.emoji.native;
    this.toggled = false;
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
