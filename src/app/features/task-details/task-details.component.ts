import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { TaskService } from '../../core/services/task.service';
import { Task, Comment } from '../../core/models/task.model';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink, QuillModule, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
  
})
export class TaskDetailsComponent implements OnInit {
  task: Task | undefined;
  newComment: string = '';
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

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