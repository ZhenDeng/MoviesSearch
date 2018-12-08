import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Movies } from 'src/models/movies';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }
    
    GetMovieList(searchString: string, pageNumber: string): Observable<any> {
      return this.http.get(`http://www.omdbapi.com/?apikey=3bd080f3&s=*${searchString}*&type=movie&r=json&page=${pageNumber}&plot=full`)
        .pipe(catchError(this.handleError));
    }

    GetMovieDetail(imdbID:string):Observable<any>{
      return this.http.get(`http://www.omdbapi.com/?apikey=3bd080f3&i=${imdbID}&plot=full`)
        .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      console.error('server error:', error);
      if (error.error instanceof ErrorEvent) {
        let errMessage = '';
        try {
          errMessage = error.error.message;
        } catch (err) {
          errMessage = error.statusText;
        }
        return Observable.throw(errMessage);
      }
    }
}
