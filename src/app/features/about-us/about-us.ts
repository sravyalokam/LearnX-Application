import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { About } from '../../models/about.model';
import { ContactUs } from '../contact-us/contact-us';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {

  about$;
  constructor(private api: Api) {
    this.about$ = this.api.getAbout();
  }

}
