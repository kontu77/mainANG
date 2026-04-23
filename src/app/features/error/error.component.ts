import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(private router: Router) {}

  messages = [
    '🔍 გვერდი ვეღარ ვიპოვე...',
    '🤖 ERROR 404: გვერდი.exe შეჩერდა',
    '☕ შეიძლება ყავა დავლიო და ვცადო?',
  ];

  goHome() {
    this.router.navigate(['/products']);
  }
}