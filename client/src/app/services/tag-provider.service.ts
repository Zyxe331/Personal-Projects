import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from 'src/app/interfaces/tag';
import { SERVER_URL } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagProviderService {
  
  public allTags: Tag[];
  public tagsById: Tag[];

  constructor(private http: HttpClient) { }

  getAllTagsAsObservable(): Observable<Tag[]> {
    return this.http.get<Tag[]>(SERVER_URL + 'tags/')
  }

  addTag(tagName: string): Observable<Tag> {
    return this.http.post<Tag>(SERVER_URL + 'tags/', {name: tagName})
  }

  async getAllTags(): Promise<Tag[]> {

    if (this.allTags && this.allTags.length > 0) {
      return this.allTags;
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let response = await _this.http.get<Tag[]>(SERVER_URL + 'tags/').toPromise();

        // As long as something returned then resolve it
        if (response && response) {

          _this.allTags = response;
          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  }

  clearProperties() {
    this.allTags = null;
  }
 /*  async getTagById(tagIds: number[]): Promise<Tag[]> {

    if (this.tagsById && this.tagsById.length > 0) {
      return this.tagsById;
    }

    let requestBody = {
      tagIds: tagIds
    }

    let _this = this;
    return new Promise(async function (resolve, reject) {

      try {

        let response = await _this.http.get<Tag[]>(SERVER_URL + 'tags/tagbyids/', requestBody).toPromise();

        // As long as something returned then resolve it
        if (response && response) {

          _this.tagsById = response;
          resolve(response);

        }
      } catch (error) {
        reject(error.error);
      }
    })
  } */

}
