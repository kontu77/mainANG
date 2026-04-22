import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;
  scrolled = false;
  menuOpen = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
    this.authService.isAdmin$.subscribe(v => this.isAdmin = v);
    this.cartService.cartCount$.subscribe(v => this.cartCount = v);
    if (this.isLoggedIn && !this.isAdmin) {
      this.cartService.getCart().subscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
