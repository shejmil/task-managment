import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Complete Angular Assignment',
      description: 'Implement a task management system using Angular 17',
      deadline: new Date('2025-10-20'),
      status: TaskStatus.InProgress,
      comments: [
        {
          id: '1',
          content: 'Started working on the task list component',
          author: 'John Doe',
          createdAt: new Date('2025-10-14'),
          replies: []
        }
      ]
    }
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return of(this.tasks.find(task => task.id === id));
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      comments: []
    };
    this.tasks.push(newTask);
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      return of(task);
    }
    throw new Error('Task not found');
  }

  deleteTask(id: string): Observable<void> {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
    return of(void 0);
  }
}