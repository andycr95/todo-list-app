import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { subTask } from 'src/app/models/subTask.model';
import { AddTaskComponent } from '../add-task/add-task.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiPipe } from 'src/app/pipes/emoji.pipe';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FormsModule, CommonModule, PickerComponent, EmojiPipe],
})
export class EditTaskComponent  implements OnInit {

  @Input() task!: Task;
  public toggled = false;
  categories: Category[] = [];
  subTasks: subTask[] = [];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
    this.subTasks = await this.taskService.getSubTasks(this.task.id);
    this.cdr.detectChanges();
  }

  async updateTask() {
    await this.taskService.updateTask(this.task);
    this.modalController.dismiss();
  }

  async openAddSubTaskModal() {
    const modal = await this.modalController.create({
      component: AddTaskComponent,
      componentProps: { taskId: this.task.id }
    });
    modal.onDidDismiss().then( async () => {
      this.subTasks = await this.taskService.getSubTasks(this.task.id);
      this.cdr.detectChanges();
    });
    await modal.present();
  }

  async deleteSubTask(subTask: subTask) {
    await this.taskService.deleteSubTask(subTask.id);
    this.subTasks = await this.taskService.getSubTasks(this.task.id);
    this.cdr.detectChanges();
  }

  async completeSubTask(subTask: subTask) {
    await this.taskService.updateSubTask(subTask);
    this.subTasks = await this.taskService.getSubTasks(this.task.id);
    this.cdr.detectChanges();
  }

  handleSelection(event: any) {
    this.task.emoji = event.emoji.native;
    this.toggled = false;
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
