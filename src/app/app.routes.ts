// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout';
import { HomeComponent } from './home/home';
import { AboutComponent } from './about/about';
import { ContactComponent } from './contact/contact';
import { ProjectItemComponent } from './project-item/project-item';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'project/:id', component: ProjectItemComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  // Catch-all route for old domain redirect
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

// Check old URL on app init and redirect
if (window.location.href.includes('tthide.github.io/Personal-Portfolio')) {
  window.location.href = 'https://tthide.github.io/';
}