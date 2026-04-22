// Auth models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  secretKey?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Product models
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductDetailedResponse extends ProductResponse {
  reviews: ReviewResponse[];
}

export interface ProductResponsePaged {
  data: {
    items: ProductResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
}

// Category models
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

// Review models
export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewResponsePaged {
  items: ReviewResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface EditReviewRequest {
  reviewId: number;
  rating: number;
  comment: string;
}

// Cart models
export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItemResponsePaged {
  items: CartItemResponse[];
  totalCount: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface EditCartItemRequest {
  productId: number;
  quantity: number;
}

// User models
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UserDetailsResponse extends UserResponse {
  createdAt: string;
  orderCount: number;
}

export interface EditProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Filter/Search
export interface ProductFilterParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}
