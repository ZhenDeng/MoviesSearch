export interface MovieResponse{
    Response: string
    Search: Movies[]
    totalResults: string
}

export interface Movies {
    Title: string
    Year: string
    imdbID: string
    Poster:string
    Genre: string
    Plot: string
    Language: string
    Director: string
    Actors: string
    Runtime: string
}
