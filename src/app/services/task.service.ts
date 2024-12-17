import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { generateId } from 'src/utils/generateIDs';
import { subTask } from '../models/subTask.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasksKey = 'tasks';
  public subTasksKey = 'subTasks';

  constructor(private storage: Storage) {}
  
  
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    return await this.storage.get(this.tasksKey) || [];
  }

  // Get a task
  async getTask(taskId: string): Promise<Task | undefined> {
    const tasks = await this.getTasks();
    return tasks.find(t => t.id === taskId);
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

  // Get subTasks
  async getSubTasks(taskId: string): Promise<subTask[]> {
    const subTasks = await this.storage.get(this.subTasksKey) || [];
    return subTasks.filter((st: subTask) => st.taskId === taskId);
  }

  // Get a subTask
  async getSubTask(subTaskId: string): Promise<subTask | undefined> {
    const subTasks = await this.storage.get(this.subTasksKey) || [];
    return subTasks.find((st: subTask) => st.id === subTaskId);
  }

  // Add a subTask
  async addSubTask(subTask: subTask): Promise<void> {
    const subTasks = await this.getSubTasks(subTask.taskId);
    subTask.id = generateId();
    subTasks.push(subTask);
    await this.storage.set(this.subTasksKey, subTasks);
  }

  // Delete a subTask
  async deleteSubTask(subTaskId: string): Promise<void> {
    const subTask = await this.getSubTask(subTaskId);
    if (subTask) {
      const subTasks = await this.getSubTasks(subTask.taskId);
      const updatedSubTasks = subTasks.filter(st => st.id !== subTaskId);
      return await this.storage.set(this.subTasksKey, updatedSubTasks);
    }
  }

  // Update a subTask
  async updateSubTask(subTask: subTask): Promise<void> {
    const subTasks = await this.getSubTasks(subTask.taskId);
    const index = subTasks.findIndex(st => st.id === subTask.id);
    if (index !== -1) {
      subTasks[index] = subTask;
      await this.storage.set(this.subTasksKey, subTasks);
    }
  }
}
