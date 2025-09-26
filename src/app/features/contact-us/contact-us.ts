import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, RouterModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css'
})
export class ContactUs {
  footerTitle = 'Contact us';
  footerSubtitle =
    'Top companies choose Skillio to build in-demand career skills.';
  footerBottom = '© 2025 Skillio. All rights reserved.';

  contactDetails = {
    phone: '+91 98765 43210',
    email: 'support@elearning.com',
    address: '123 Learning Street, Hyderabad, India'
  };

}
