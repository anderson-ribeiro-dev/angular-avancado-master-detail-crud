import { CategoryFormComponent } from './category-form/category-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Routes = [
  { path: '', component: CategoryListComponent }, // list
  { path: 'new', component: CategoryFormComponent }, // id
  { path: ':id/edit', component: CategoryFormComponent } // edit
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
