import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Api } from '../services/api';
import { NavbarItems } from '../models/navbar.model';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBar implements OnInit {



  nav_items: NavbarItems[] = [];

  constructor(private api: Api,  private auth: Auth, private router: Router) { }

  ngOnInit(): void {
    this.api.getNavItems().subscribe((data) => {
      this.nav_items = data;
    });
  }

  onLogout(): void {
    this.auth.logout();
     console.log('After logout:', sessionStorage.getItem('learnx_session'));          
    this.router.navigate(['/signin']);  
  }

}
