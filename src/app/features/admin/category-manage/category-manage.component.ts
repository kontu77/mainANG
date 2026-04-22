import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { CategoryResponse } from '../../../models/models';

@Component({
  selector: 'app-category-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.scss'
})
export class CategoryManageComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: CategoryResponse[] = [];
  loading = false;
  saving = false;
  deleting: number | null = null;
  error = '';
  success = '';
  showModal = false;
  editingCategory: CategoryResponse | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(5)]]
  });

  get f() { return this.form.controls; }

  ngOnInit() { this.load(); }

 load() {
  this.loading = true;
  this.categoryService.getCategories().subscribe({
    next: (res: any) => { 
      this.categories = res.data || res; 
      this.loading = false; 
    },
    error: (e: any) => { this.error = e.error?.message || 'Failed to load.'; this.loading = false; }
  });
}

  openCreate() {
    this.editingCategory = null;
    this.form.reset();
    this.showModal = true;
    this.error = '';
  }

  openEdit(cat: CategoryResponse) {
    this.editingCategory = cat;
    this.form.patchValue({ name: cat.name, description: cat.description });
    this.showModal = true;
    this.error = '';
  }

  closeModal() { this.showModal = false; this.editingCategory = null; this.form.reset(); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const data = this.form.value as any;
    const obs = this.editingCategory
      ? this.categoryService.updateCategory(this.editingCategory.id, data)
      : this.categoryService.createCategory(data);

    obs.subscribe({
      next: () => {
        this.success = this.editingCategory ? 'Category updated!' : 'Category created!';
        this.saving = false;
        this.closeModal();
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: (e) => { this.error = e.error?.message || 'Save failed.'; this.saving = false; }
    });
  }

  delete(id: number) {
    if (!confirm('Delete this category?')) return;
    this.deleting = id;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.deleting = null;
        this.success = 'Category deleted.';
        setTimeout(() => this.success = '', 3000);
      },
      error: (e) => { this.error = e.error?.message || 'Delete failed.'; this.deleting = null; }
    });
  }
}
