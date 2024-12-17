import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { generateId } from 'src/utils/generateIDs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasksKey = 'tasks';

  constructor(private storage: Storage) {}
  
  
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    return await this.storage.get(this.tasksKey) || [];
  }

  // Add a task
  async addTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    task.id = generateId();
    tasks.push(task);
    await this.storage.set(this.tasksKey, tasks);
  }

  // Update a task
  async updateTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      await this.storage.set(this.tasksKey, tasks);
    }
  }

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    await this.storage.set(this.tasksKey, updatedTasks);
  }
}
