import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">{{ task.id ? 'Edit' : 'Add' }} Task</h2>
        
        <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="task.title"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <quill-editor
                [(ngModel)]="task.description"
                name="description"
                required
                [styles]="{ height: '150px' }"
              ></quill-editor>
            </div>

            <div>
              <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                [ngModel]="task.deadline | date:'yyyy-MM-ddTHH:mm'"
                (ngModelChange)="task.deadline = $event"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                [(ngModel)]="task.status"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option [value]="TaskStatus.Pending">Pending</option>
                <option [value]="TaskStatus.InProgress">In Progress</option>
                <option [value]="TaskStatus.Completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="!taskForm.form.valid"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {{ task.id ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class TaskDialogComponent implements OnInit {
  TaskStatus = TaskStatus; // Make enum available in template
  
  @Input() task: Partial<Task> = {
    title: '',
    description: '',
    deadline: new Date(),
    status: TaskStatus.Pending
  };

  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  private taskCopy!: Partial<Task>;

  ngOnInit(): void {
    // Create a copy of the task to avoid modifying the original
    this.taskCopy = { ...this.task };
  }

  onSubmit(): void {
    this.save.emit(this.taskCopy as Task);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}