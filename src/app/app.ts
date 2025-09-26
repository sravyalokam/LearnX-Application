import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { HomePage } from './features/Home/home-page/home-page';
// import { Forms } from './shared/components/forms/forms';
// import { AboutUs } from './features/about-us/about-us';
// import { CoursesSection } from './features/courses/courses';
// import { AssignmentsSection } from './features/assignments/assignments';
import { ContactUs } from './features/contact-us/contact-us';
// import { CourseDetails } from './features/courses/course-details/course-details';
import { SignIn } from './signin-page/signin-page';
import { CommonModule } from '@angular/common';
import { OfferBanner } from './offer-banner/offer-banner';
import { Router } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [

    RouterOutlet,
    NavBar,
    // Forms,
    // HomePage,
    // AboutUs,
    // CoursesSection,
    // AssignmentsSection,
    ContactUs,
    // CourseDetails,
    // SignIn,
    CommonModule,
    OfferBanner,

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
  

  isBannerOpen = true;

  constructor(private router: Router, private authService: Auth) {

    const bannerClosed = sessionStorage.getItem('bannerClosed');
    this.isBannerOpen = bannerClosed !== 'true';
  }

  toggleBanner(state: boolean) {
    this.isBannerOpen = state;
    if (!state) {

      sessionStorage.setItem('bannerClosed', 'true');
    }
  }

  showNavbar(): boolean {
    const noNavRoutes = ['/signin', '/signup', '/forgetpassword'];
    return !noNavRoutes.includes(this.router.url) && this.authService.isLoggedIn();
  }

}



