import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterModule],
  template: `<div class="unauthorized d-flex justify-content-center align-items-center" style="min-height: 100vh;">
  <div class="text-center">
    <h2>Access Denied</h2>
    <p>You don’t have permission to view this page.</p>
    <a routerLink="/homepage" class="btn btn-primary">Go back home</a>
  </div>
</div>
`,
  styleUrl: './unauthorized.css'
})
export class Unauthorized {

}
