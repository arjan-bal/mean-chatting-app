import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map((post: { _id: string; title: string; content: string; }) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      }))
      .subscribe((transformedPosts: Post[]) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    // return observable and subscribe at destination,
    // because you can return from within a subscribe block
    // as it is asynchoronous code
    return this.http.get<{message: string, post: any}>('http://localhost:3000/api/posts/' + postId)
  }

  getPostUpdateListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    // send new post to server
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        // optmistic updating on local copy
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(postId: string, title: string, content: string) {
    const post: Post = {
      id: postId,
      title: title,
      content: content
    };
    this.http.put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const postIndex = updatedPosts.findIndex(post => post.id === postId);
        updatedPosts[postIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // optimistic updating
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
