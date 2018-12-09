import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from 'src/services/http.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR})

  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
