import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error:string ;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    this.error = null;

    let authObs:Observable<AuthResponseData>;
    this.isLoading = true;
    if(this.isLoginMode){
      authObs = this.authService.login(form.value.email, form.value.password);
    } else {
      authObs = this.authService.signUp(form.value.email, form.value.password);      
    }

    authObs.subscribe((authDataResponse)=>{
      console.log(authDataResponse);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    },
    (errorMessage) => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });

    form.reset();
  }

}
