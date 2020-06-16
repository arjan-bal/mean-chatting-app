import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
  post: Post;
  private mode: string = 'create';
  private postId: string;

  constructor(public PostsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    // observable to listen to changes in route urls/params
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.PostsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid){
      return ;
    }
    if (this.mode === 'edit') {
      this.PostsService.updatePost(this.postId, form.value.title, form.value.content);
    } else {
      this.PostsService.addPost(form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
