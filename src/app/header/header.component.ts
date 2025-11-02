import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../service/menu.service';
import { Menu } from '../model/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {
  public menus: Menu[] = []
  public isScrolled: boolean = false;

  constructor(private menuService: MenuService) {
  }

  ngOnInit(): void {
      this.menuService.getData().subscribe(data => {this.menus = data; });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
    if (this.isScrolled) {
      document.body.classList.add('header-at-top');
    } else {
      document.body.classList.remove('header-at-top');
    }
  }
}
