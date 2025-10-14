import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
  TaskStatus = TaskStatus; 
  
  @Input() task: Partial<Task > = {
    title: '',
    description: '',
    deadline: new Date(),
    status: TaskStatus.Pending
  };

  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskCopy!: Partial<Task>;

  // Enhanced Quill configuration
  quillConfig = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ],
      clipboard: {
        matchVisual: false
      }
    },
    placeholder: 'Describe your task in detail...',
    theme: 'snow',
    bounds: '.content-editor',
    formats: [
      'bold', 'italic', 'underline', 'strike',
      'blockquote', 'code-block',
      'header',
      'list', 'bullet',
      'indent',
      'align',
      'link'
    ]
  };

  ngOnInit(): void {
    this.taskCopy = { ...this.task };
  }

  onSubmit(): void {
    if (this.taskCopy.title && this.taskCopy.description && this.taskCopy.deadline && this.taskCopy.status) {
      this.save.emit(this.taskCopy as Task);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}