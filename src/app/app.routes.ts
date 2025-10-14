import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/task-list/task-list.component')
      .then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./features/task-details/task-details.component')
      .then(m => m.TaskDetailsComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar-view/calendar-view.component')
      .then(m => m.CalendarViewComponent)
  }
];
