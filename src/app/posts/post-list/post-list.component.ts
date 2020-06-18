import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currrentPage = 1;

  constructor(public PostsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.PostsService.getPosts(this.postsPerPage, this.currrentPage);
    this.postsSub = this.PostsService.getPostUpdateListner()
      .subscribe((postsData: {
        posts: Post[],
        postsCount: number
      }) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postsCount;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.PostsService.deletePost(postId).subscribe(() => {
      this.isLoading = true;
      this.PostsService.getPosts(this.postsPerPage, this.currrentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.currrentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.PostsService.getPosts(this.postsPerPage, this.currrentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
