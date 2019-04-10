import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutComponent } from './shortcut/shortcut.component';

@NgModule({
  declarations: [
    ShortcutComponent
  ],
  exports: [
    ShortcutComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
   
  ]
})
export class ShortcutModule { }