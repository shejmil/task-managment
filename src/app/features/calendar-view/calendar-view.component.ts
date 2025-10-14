import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Task, TaskStatus } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';


@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
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

  viewPrev() { (document.querySelector('.fc-prev-button') as HTMLButtonElement)?.click(); }
  viewNext() { (document.querySelector('.fc-next-button') as HTMLButtonElement)?.click(); }
  viewToday() { (document.querySelector('.fc-today-button') as HTMLButtonElement)?.click(); }
}