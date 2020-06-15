// modules in angular are building blocks
// that angular analyses to know whcih features
// your app uses

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

// routes are js objects which decide for which url,
// which part of app should be presented

const routes: Routes = [
  // empty path means root path
  { path: '', component: PostListComponent },
  // localhost:4200/create
  { path: 'create', component:  PostCreateComponent},
  { path: 'edit/:postId', component: PostCreateComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
