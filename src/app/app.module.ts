import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { RondevuPaginatorModule } from 'src/components/rondevu-paginator/rondevu-paginator.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, MatPaginatorModule, RondevuPaginatorModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
