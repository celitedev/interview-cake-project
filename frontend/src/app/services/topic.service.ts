import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Topic } from './topic';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TopicService {

  private topicsUrl = 'api/topics';  // URL to web api

  constructor(private http: HttpClient) { }

  getTopics (): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.topicsUrl)
      .pipe(
        catchError(this.handleError('getTopics', []))
      );
  }

  getTopicNo404<Data>(id: number): Observable<Topic> {
    const url = `${this.topicsUrl}/?id=${id}`;
    return this.http.get<Topic[]>(url)
      .pipe(
        map(topics => topics[0]),
        catchError(this.handleError<Topic>(`getTopic id=${id}`))
      );
  }

  /** GET topic by id. Will 404 if id not found */
  getTopic(id: number): Observable<Topic> {
    const url = `${this.topicsUrl}/${id}`;
    return this.http.get<Topic>(url).pipe(
      catchError(this.handleError<Topic>(`getTopic id=${id}`))
    );
  }

  /* GET topics whose name contains search term */
  searchTopics(term: string): Observable<Topic[]> {
    if (!term.trim()) {
      // if not search term, return empty topic array.
      return of([]);
    }
    return this.http.get<Topic[]>(`${this.topicsUrl}/?name=${term}`).pipe(
      catchError(this.handleError<Topic[]>('searchTopics', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
