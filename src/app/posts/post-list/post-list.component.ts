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
  posts: Post[] = [];
  private postsSub: Subscription;
  public isLoading = false;

  constructor(public PostsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.PostsService.getPosts();
    this.postsSub = this.PostsService.getPostUpdateListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.PostsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
