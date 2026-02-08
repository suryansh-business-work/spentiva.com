import CategoryModel from './category.models';
import { CategoryType } from './category.models';

/**
 * Category Service - Business logic for categories
 */
export class CategoryService {
  /**
   * Get all categories with their subcategories
   * Optionally filter by type (expense, income, debit_mode, credit_mode)
   */
  static async getAllCategories(trackerId?: string, type?: CategoryType) {
    const query: Record<string, unknown> = {};
    if (trackerId) query.trackerId = trackerId;
    if (type) query.type = type;
    const categories = await CategoryModel.find(query).sort({ createdAt: -1 });
    return categories;
  }

  /**
   * Get a specific category by ID
   */
  static async getCategoryById(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  /**
   * Create a new category
   */
  static async createCategory(
    trackerId: string,
    name: string,
    subcategories: Array<{ id: string; name: string }>,
    type: CategoryType = 'expense'
  ) {
    const category = await CategoryModel.create({
      trackerId,
      name,
      type,
      subcategories,
    });
    return category;
  }

  /**
   * Update a category
   */
  static async updateCategory(
    categoryId: string,
    updates: { name?: string; type?: CategoryType; subcategories?: Array<{ id: string; name: string }> }
  ) {
    const category = await CategoryModel.findByIdAndUpdate(categoryId, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Delete a category
   */
  static async deleteCategory(categoryId: string) {
    const category = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }
}

export default CategoryService;
