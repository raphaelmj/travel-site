import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';


@NgModule({
  declarations: [CustomCheckboxComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [

  ],
  exports: [CustomCheckboxComponent]
})
export class ToolsModule { }
