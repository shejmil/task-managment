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
      description: '<p>Implement a task management system using Angular 17</p>',
      deadline: new Date('2025-10-20'),
      status: TaskStatus.InProgress,
      category: 'Development',
      assignees: ['John', 'Sarah', 'Mike'],
      progress: 65,
      comments: [
        {
          id: '1',
          content: 'Started working on the task list component',
          author: 'John Doe',
          createdAt: new Date('2025-10-14'),
          replies: []
        }
      ]
    },
    {
      id: '2',
      title: 'Design UI/UX Mockups',
      description: '<p>Create modern, vibrant design mockups for the dashboard</p>',
      deadline: new Date('2025-10-22'),
      status: TaskStatus.Pending,
      category: 'Design',
      assignees: ['Emma', 'David'],
      progress: 20,
      comments: []
    },
    {
      id: '3',
      title: 'Setup CI/CD Pipeline',
      description: '<p>Configure automated deployment and testing</p>',
      deadline: new Date('2025-10-25'),
      status: TaskStatus.Completed,
      category: 'DevOps',
      assignees: ['Alex'],
      progress: 100,
      comments: []
    },
    {
      id: '4',
      title: 'Write Documentation',
      description: '<p>Create comprehensive user and developer documentation</p>',
      deadline: new Date('2025-10-27'),
      status: TaskStatus.Pending,
      category: 'Documentation',
      assignees: ['Lisa', 'Tom'],
      progress: 10,
      comments: []
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