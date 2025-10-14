import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { TaskService } from '../../../core/services/task.service';
import { Task, Comment } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink, QuillModule],
  template: `
    <div class="container mx-auto p-4">
      @if (task) {
        <div class="mb-4">
          <a routerLink="/tasks" class="text-blue-500 hover:text-blue-700">← Back to Tasks</a>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-3xl font-bold">{{ task.title }}</h1>
            <span
              class="px-3 py-1 rounded-full text-sm"
              [ngClass]="{
                'bg-yellow-100 text-yellow-800': task.status === 'Pending',
                'bg-blue-100 text-blue-800': task.status === 'In Progress',
                'bg-green-100 text-green-800': task.status === 'Completed'
              }"
            >
              {{ task.status }}
            </span>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Description</h2>
            <quill-view-html [content]="task.description"></quill-view-html>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Due Date</h2>
            <p class="text-gray-600">{{ task.deadline | date:'medium' }}</p>
          </div>

          <div class="border-t pt-6">
            <h2 class="text-xl font-semibold mb-4">Comments</h2>
            
            <div class="mb-4">
              <quill-editor
                [(ngModel)]="newComment"
                [styles]="{ height: '100px' }"
                placeholder="Add a comment..."
              ></quill-editor>
              <button
                class="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                (click)="addComment()"
              >
                Add Comment
              </button>
            </div>

            <div class="space-y-4">
              @for (comment of task.comments; track comment.id) {
                <div class="bg-gray-50 p-4 rounded">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-semibold">{{ comment.author }}</p>
                      <p class="text-sm text-gray-500">{{ comment.createdAt | date }}</p>
                    </div>
                  </div>
                  <div class="mt-2" [innerHTML]="comment.content"></div>

                  @if (comment.replies.length > 0) {
                    <div class="ml-8 mt-4 space-y-4">
                      @for (reply of comment.replies; track reply.id) {
                        <div class="bg-white p-4 rounded border">
                          <div class="flex justify-between items-start">
                            <div>
                              <p class="font-semibold">{{ reply.author }}</p>
                              <p class="text-sm text-gray-500">{{ reply.createdAt | date }}</p>
                            </div>
                          </div>
                          <div class="mt-2" [innerHTML]="reply.content"></div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <p>Loading...</p>
      }
    </div>
  `,
  styles: []
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTask(params['id']);
      }
    });
  }

  loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe(task => {
      this.task = task;
    });
  }

  addComment(): void {
    if (!this.task || !this.newComment) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: this.newComment,
      author: 'Current User', // TODO: Implement user management
      createdAt: new Date(),
      replies: []
    };

    this.task.comments.push(comment);
    this.taskService.updateTask(this.task).subscribe(() => {
      this.newComment = '';
    });
  }
}