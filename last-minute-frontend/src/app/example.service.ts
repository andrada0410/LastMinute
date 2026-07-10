import { inject, Injectable } from '@angular/core';
import { ExampleInfo } from './example';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  url = 'http://localhost:4001/example';
  private http = inject(HttpClient);

  getAllExamples(): Observable<ExampleInfo[]> {
    return this.http.get<ExampleInfo[]>(this.url);
  }

  getExampleById(id: number): Observable<ExampleInfo> {
    return this.http.get<ExampleInfo>(`${this.url}/${id}`);
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    // tslint:disable-next-line
    console.log(firstName, lastName, email);
  }
}
