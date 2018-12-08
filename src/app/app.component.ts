import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/services/http.service';
import { Movies, MovieResponse } from 'src/models/movies';
import * as _ from 'lodash';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  catalogueFilterValue: string;
  searchString: string = "";
  filterString: string = "";
  pageNumber: number = 1;
  pageNumberTotal: number;
  movies: Movies[];
  movieDetail: Movies;
  total: string;
  showDetails: boolean = false;
  hasMovies: string = "";

  constructor(
    private httpService: HttpService
  ) { }

  //when search string changed, call this method
  onChange(): void {
    this.hasMovies = "";
    this.movies = [];
    this.showDetails = false;
    this.pageNumber = 1;
    if(this.searchString){
      this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
        if (res.Response == 'True') {
          this.movies = res.Search;
          this.total = res.totalResults;
          this.pageNumberTotal = _.toNumber(this.total)/10;
          this.hasMovies = "true";
        }else{
          this.hasMovies = "false";
        }
      },
        (error: any) => {
          console.error(error);
        });
    }else{
      //when search string is null, reset movies to empty array
      this.movies=[];
    }
  }

  //when click right arrow, call this method to go to next page
  pageNext(): void {
    this.hasMovies = "";
    this.pageNumber = this.pageNumber + 1;
    this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
      if (res.Response == 'True') {
        this.movies = res.Search;
        this.total = res.totalResults;
        //hasMovies control "no result found" message, when set to false, "no result found message" will be shown
        this.hasMovies = "true";
      }else{
        this.hasMovies = "false";
      }
    },
      (error: any) => {
        console.error(error);
      });
  }

  //when click left arrow, call this method to go to previous page
  pagePre(): void {
    this.hasMovies = "";
    this.pageNumber = this.pageNumber - 1;
    this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
      if (res.Response == 'True') {
        this.movies = res.Search;
        this.total = res.totalResults;
        this.hasMovies = "true";
      }else{
        this.hasMovies = "false";
      }
    },
      (error: any) => {
        console.error(error);
      });
  }

  //when click movie, call this method to show movie information
  showMovieDetails(movie: Movies): void
  { 
    this.showDetails = true;
    $('.selecticon').css('display', 'none');
    $(`#${movie.imdbID}`).css('display', 'block');
    this.httpService.GetMovieDetail(movie.imdbID).subscribe((res: Movies) => {
      if(res){
        this.movieDetail = res;
      }
    },  
      (error: any) => {
        console.error(error);
      });
  }
}
