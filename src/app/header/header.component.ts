import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector:'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
    
})
export class HeaderComponent implements OnInit, OnDestroy {

    userSub: Subscription;
    isAuthenticated:boolean = false;

    constructor(private dataStorageService:DataStorageService, private authService:AuthService){}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe( (user) => {
            this.isAuthenticated = !!user;
        });
    }
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}