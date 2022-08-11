import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RondevuPaginatorComponent } from './rondevu-paginator.component';

@NgModule({
  declarations: [
    RondevuPaginatorComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [ RondevuPaginatorComponent ]
})
export class RondevuPaginatorModule { }
