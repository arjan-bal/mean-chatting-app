import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/posts`;

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsCount ;
  private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  async getPosts(pageSize: number, currentPage: number) {
    const query = `?pageSize=${pageSize}&page=${currentPage}`;
    const transformedPostsData = await this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + query)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      ).toPromise();
      // console.log(transformedPostsData);
      this.posts = transformedPostsData.posts;
      this.postsCount = transformedPostsData.maxPosts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postsCount: this.postsCount
      });
  }

  getPost(postId: string) {
    // return observable and subscribe at destination,
    // because you can't return from within a subscribe block
    // as it is asynchoronous code
    return this.http.get<{message: string, post: any}>(`${BACKEND_URL}/${postId}`)
  }

  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  async addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    // send new post to server
    // angular will automatically detect formdata and set the required headers
    const responseData = await this.http.post<{message: string, post: Post}>(
      BACKEND_URL,
      postData
    ).toPromise()
    this.router.navigate(['/']);
  }

  async updatePost(postId: string, title: string, content: string, image: string | File) {
    // there can be two type of updates
    // one with image as string, we need to send a json put request
    // one with image as file, we need to send formdata put request
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      // file will be an object, formdata request
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      // json request
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    const response = await this.http.put(`${BACKEND_URL}/${postId}`, postData).toPromise();
    this.router.navigate(['/']);
  }

  deletePost(postId: string) {
    return this.http.delete(`${BACKEND_URL}/${postId}`);
  }
}
