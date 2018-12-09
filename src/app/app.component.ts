import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/services/http.service';
import { Movies, MovieResponse } from 'src/models/movies';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';

declare var $: any;

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
  moviesFilter: Movies[];
  movieDetail: Movies;
  total: string;
  showDetails: boolean = false;
  hasMovies: string = "";

  constructor(
    private httpService: HttpService,
    private logger: NGXLogger
  ) { }

  //when search string changed, call this method
  onChange(): void {
    this.hasMovies = "";
    this.movies = [];
    this.showDetails = false;
    this.pageNumber = 1;
    if (this.searchString) {
      // if search string is not empty, call api to get movie list
      this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
        if (res.Response == 'True') {
          this.movies = res.Search;
          // reset movie filter model with returned movie list
          this.moviesFilter = this.movies
          this.total = res.totalResults;
          //get total page number -- total movie number divide 10 result per page
          this.pageNumberTotal = _.toNumber(this.total) / 10;
          this.hasMovies = "true";
        } else {
          this.hasMovies = "false";
        }
      },
        (error: any) => {
          this.logger.debug(error);
        });
    } else {
      //when search string is null, reset movies to empty array
      this.movies = [];
    }
  }

  //when click right arrow, call this method to go to next page
  pageNext(): void {
    this.hasMovies = "";
    this.pageNumber = this.pageNumber + 1;
    //when page number changed ,send page number as a parameter to api to render movie list
    this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
      if (res.Response == 'True') {
        this.movies = res.Search;
        // reset movie filter model with returned movie list
        this.moviesFilter = this.movies
        this.total = res.totalResults;
        //hasMovies control "no result found" message, when set to false, "no result found message" will be shown
        this.hasMovies = "true";
      } else {
        this.hasMovies = "false";
      }
    },
      (error: any) => {
        this.logger.debug(error);
      });
  }

  //when click left arrow, call this method to go to previous page
  pagePre(): void {
    this.hasMovies = "";
    this.pageNumber = this.pageNumber - 1;
    //when page number changed ,send page number as a parameter to api to render movie list
    this.httpService.GetMovieList(this.searchString, this.pageNumber.toString()).subscribe((res: MovieResponse) => {
      if (res.Response == 'True') {
        this.movies = res.Search;
        // reset movie filter model with returned movie list
        this.moviesFilter = this.movies
        //total results value
        this.total = res.totalResults;
        this.hasMovies = "true";
      } else {
        this.hasMovies = "false";
      }
    },
      (error: any) => {
        this.logger.debug(error);
      });
  }

  //when click movie, call this method to show movie information
  showMovieDetails(movie: Movies): void {
    this.showDetails = true;
    // every movie has a unique layout id of imdbID, when a movie is clicked, split the block with movie list on the left side and movie details on the right side
    $('.selecticon').css('display', 'none');
    $(`#${movie.imdbID}`).css('display', 'block');
    this.httpService.GetMovieDetail(movie.imdbID).subscribe((res: Movies) => {
      if (res) {
        this.movieDetail = res;
      }
    },
      (error: any) => {
        this.logger.debug(error);
      });
  }

  onFilter(): void {
    //filter movies by three conditions -- title, year of release and imdbID
    this.moviesFilter = this.movies.filter(movie =>
      movie.Title.toLowerCase().includes(this.filterString.toLowerCase()) ||
      movie.Year.toLowerCase().includes(this.filterString.toLowerCase()) ||
      movie.imdbID.toLowerCase().includes(this.filterString.toLowerCase())
    )
  }
}
