import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TaskDialogComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  showDialog = false;
  selectedTask: Partial<Task> | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  openEditTaskDialog(task: Task): void {
    this.selectedTask = { ...task };
    this.showDialog = true;
  }

  openAddTaskDialog(): void {
    this.selectedTask = {};
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.selectedTask = null;
  }

  onSaveTask(task: Task): void {
    if (task.id) {
      this.taskService.updateTask(task).subscribe(() => {
        this.loadTasks();
        this.closeDialog();
      });
    } else {
      this.taskService.addTask(task).subscribe(() => {
        this.loadTasks();
        this.closeDialog();
      });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
}