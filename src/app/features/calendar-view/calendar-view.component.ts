import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Task Calendar</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <full-calendar
          [options]="calendarOptions"
        ></full-calendar>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .fc-event {
      cursor: pointer;
    }
    :host ::ng-deep .task-status-pending {
      background-color: #fef3c7;
      border-color: #f59e0b;
      color: #92400e;
    }
    :host ::ng-deep .task-status-in-progress {
      background-color: #dbeafe;
      border-color: #3b82f6;
      color: #1e40af;
    }
    :host ::ng-deep .task-status-completed {
      background-color: #dcfce7;
      border-color: #22c55e;
      color: #166534;
    }
  `]
})
export class CalendarViewComponent implements OnInit {
  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.calendarOptions.events = tasks.map(task => this.taskToCalendarEvent(task));
    });
  }

  private taskToCalendarEvent(task: Task): any {
    const statusClass = this.getStatusClass(task.status);
    return {
      id: task.id,
      title: task.title,
      start: task.deadline,
      className: statusClass,
      extendedProps: {
        status: task.status,
        description: task.description
      }
    };
  }

  private getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:
        return 'task-status-pending';
      case TaskStatus.InProgress:
        return 'task-status-in-progress';
      case TaskStatus.Completed:
        return 'task-status-completed';
      default:
        return '';
    }
  }

  handleEventClick(arg: EventClickArg): void {
    const taskId = arg.event.id;
    this.router.navigate(['/tasks', taskId]);
  }
}