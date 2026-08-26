import { Component, input, output, effect, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Product } from "../product";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { resolveImagePath } from "../utils";

@Component({
  selector: "app-shop-dashboard-product-form",
  standalone: true,
  imports: [ReactiveFormsModule, ShopDashboardImage],
  template: `
  <div class="form">
    <div class="form-content">

      <h2>{{ product() ? 'Editează produs' : 'Adaugă produs' }}</h2>

      <form class="form-card" [formGroup]="productForm" (ngSubmit)="submit()">

        <app-shop-dashboard-image class="product-form-image"
          [imageUrl]="imagePreview"
          [fallbackImage]="'assets/shop-dashboard/default-product.png'"
          label="Alege imagine"
          [isEditing]="true"
          (imageSelected)="onImageSelected($event)"
        />

        <label>Denumire:</label>
        <input type="text" formControlName="name">

        @if(productForm.get('name')?.hasError('required') && productForm.get('name')?.touched){
          <p class="error message">Denumirea este obligatorie.</p>
        }
        @if(productForm.get('name')?.hasError('maxlength')){
          <p class="error message">Denumirea nu poate avea mai mult de 100 de caractere.</p>
        }

        <label>Preț:</label>
        <input type="number" step="0.01" formControlName="price">

        @if(productForm.get('price')?.invalid && productForm.get('price')?.touched){
          <p class="error message">Prețul trebuie să fie minim 0,01.</p>
        }

        <label>Descriere:</label>
        <textarea rows="5" formControlName="description"></textarea>

        @if(productForm.get('description')?.hasError('required') && productForm.get('description')?.touched){
          <p class="error message">Descrierea este obligatorie.</p>
        }
        @if(productForm.get('description')?.hasError('maxlength')){
          <p class="error message">Descrierea nu poate avea mai mult de 1000 de caractere.</p>
        }

        @if(backendError()){
          <p class="error message">{{ backendError() }}</p>
        }

        <div class="form-actions">
          <button type="button" class="button secondary" (click)="cancel.emit()">Anulează</button>

          <button type="submit" class="button primary" [disabled]="productForm.invalid || !hasChanges()">
            {{ product() ? 'Salvează modificări' : 'Adaugă produs' }}

          </button>
        </div>

      </form>

    </div>
  </div>
  `,
  styleUrls: ["./shop-dashboard-product-form.css"]
})
export class ShopDashboardProductForm {

  product = input<Product | null>(null);

  backendError = input("");

  save = output<{
    name: string;
    price: number;
    description: string;
    photo: File | null;
  }>();

  cancel = output<void>();

  productForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    price: new FormControl(0.01, [Validators.required, Validators.min(0.01)]),
    description: new FormControl("", [Validators.required, Validators.maxLength(1000)])
  });

  selectedPhoto: File | null = null;

  imagePreview = "";

  hasChanges = signal(true);

  private initialValues = { name: "", price: 0.01, description: "" };

  constructor() {

    effect(() => {

      const product = this.product();

      if (!product) {
        this.productForm.reset({
          name: "",
          price: 0.01,
          description: ""
        });

        this.imagePreview = "";
        this.selectedPhoto = null;

        this.initialValues = { name: "", price: 0.01, description: "" };
        this.hasChanges.set(true);

        return;
      }

      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description
      });

      this.initialValues = {
        name: product.name,
        price: product.price,
        description: product.description
      };

      this.imagePreview = resolveImagePath(product.photoPath, 'assets/shop-dashboard/default-product.png');
      this.selectedPhoto = null;
      this.hasChanges.set(false);

    });

    this.productForm.valueChanges.subscribe(() => this.isChanged());

  }

  private isChanged(): void {
    const currentProduct = this.product();

    if (!currentProduct) {
      this.hasChanges.set(true);
      return;
    }

    const current = this.productForm.value;

    const changed = current.name !== this.initialValues.name ||
                    current.price !== this.initialValues.price ||
                    current.description !== this.initialValues.description ||
                    this.selectedPhoto !== null;

    this.hasChanges.set(changed);
  }

  onImageSelected(file: File) {
    this.selectedPhoto = file;
    this.isChanged();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);

  }

  submit() {
    if (this.productForm.invalid || !this.hasChanges()) {
      return;
    }

    this.save.emit({
      name: this.productForm.value.name!,
      price: this.productForm.value.price!,
      description: this.productForm.value.description!,
      photo: this.selectedPhoto
    });

  }

}