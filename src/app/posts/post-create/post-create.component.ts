import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(public PostsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    // observable to listen to changes in route urls/params
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.PostsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }


  onSavePost() {
    if (this.form.invalid){
      return ;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.PostsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    } else {
      this.PostsService.addPost(
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }


  onImagePick(event: Event) {
    // explicit type conversion below
    const file = (event.target as HTMLInputElement).files[0];
    // not limited to storing text in a form, here we store file object
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    // callback to run when file is read
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    }
    reader.readAsDataURL(file);
  }
}
