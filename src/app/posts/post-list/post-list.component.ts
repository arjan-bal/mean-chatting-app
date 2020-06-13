import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model'
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: 'First Post', content: 'This is the first post'},
  //   {title: 'Second Post', content: 'This is the second post'},
  //   {title: 'Third Post', content: 'This is the third post'}
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public PostsService: PostsService) {}

  ngOnInit() {
    this.posts = this.PostsService.getPosts();
    this.postsSub = this.PostsService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
