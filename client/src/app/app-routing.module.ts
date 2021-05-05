import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: () =>  import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () =>  import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'profile', loadChildren: () =>  import('./pages/profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'content-cycle', loadChildren: () =>  import('./pages/content-cycle/content-cycle.module').then(m => m.ContentCyclePageModule) },
  { path: 'change-content-cycle', loadChildren: () =>  import('./pages/change-content-cycle/change-content-cycle.module').then(m => m.ChangeContentCyclePageModule) },
  { path: 'section/:sectionNumber', loadChildren: () =>  import('./pages/section/section.module').then(m => m.SectionPageModule) },
  { path: 'journals', loadChildren: () =>  import('./pages/journals/journals.module').then(m => m.JournalsPageModule) },
  { path: 'journal', loadChildren: () =>  import('./pages/journal/journal.module').then(m => m.JournalPageModule) },
  { path: 'add-journal', loadChildren: () =>  import('./pages/add-journal/add-journal.module').then(m => m.AddJournalPageModule) },
  { path: 'prayer-requests', loadChildren: () =>  import('./pages/prayer-requests/prayer-requests.module').then(m => m.PrayerRequestsPageModule) },
  { path: 'prayer-request', loadChildren: () =>  import('./pages/prayer-request/prayer-request.module').then(m => m.PrayerRequestPageModule) },
  { path: 'groups', loadChildren: () =>  import('./pages/groups/groups.module').then(m => m.GroupsPageModule) },
  { path: 'group', loadChildren: () =>  import('./pages/group/group.module').then(m => m.GroupPageModule) },
  { path: 'add-group', loadChildren: () =>  import('./pages/add-group/add-group.module').then(m => m.AddGroupPageModule) },
  { path: 'notifications', loadChildren: () =>  import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule) },
  { path: 'notification', loadChildren: () =>  import('./pages/notification/notification.module').then(m => m.NotificationPageModule) }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
