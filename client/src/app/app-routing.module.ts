import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'content-cycle', loadChildren: './pages/content-cycle/content-cycle.module#ContentCyclePageModule' },
  { path: 'change-content-cycle', loadChildren: './pages/change-content-cycle/change-content-cycle.module#ChangeContentCyclePageModule' },
  { path: 'section/:sectionNumber', loadChildren: './pages/section/section.module#SectionPageModule' },
  { path: 'journals', loadChildren: './pages/journals/journals.module#JournalsPageModule' },
  { path: 'journal', loadChildren: './pages/journal/journal.module#JournalPageModule' },
  { path: 'add-journal', loadChildren: './pages/add-journal/add-journal.module#AddJournalPageModule' },
  { path: 'prayer-requests', loadChildren: './pages/prayer-requests/prayer-requests.module#PrayerRequestsPageModule' },
  { path: 'prayer-request', loadChildren: './pages/prayer-request/prayer-request.module#PrayerRequestPageModule' },
  { path: 'groups', loadChildren: './pages/groups/groups.module#GroupsPageModule' },
  { path: 'group', loadChildren: './pages/group/group.module#GroupPageModule' },
  { path: 'add-group', loadChildren: './pages/add-group/add-group.module#AddGroupPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'notification', loadChildren: './pages/notification/notification.module#NotificationPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
