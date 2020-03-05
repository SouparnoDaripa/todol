import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';



@NgModule({
  declarations: [NavbarComponent, NotFoundComponent, SidebarComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    NotFoundComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
