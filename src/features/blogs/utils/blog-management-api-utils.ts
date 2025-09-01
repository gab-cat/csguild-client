import { blogManagementApi as blogManagementApiInstance } from '@/lib/api'
import { CategoryActionResponseDto, CategoryListResponseDto, TagActionResponseDto, TagListResponseDto } from '@generated/api-client'

// Blog Management API functions for categories and tags (admin only)
export const blogManagementApiUtils = {
  // Category Management
  
  // Get categories for management
  async getCategories(page?: number, limit?: number): Promise<CategoryListResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerGetCategories({
      page,
      limit
    })
    return response.data
  },

  // Create a new category
  async createCategory(): Promise<CategoryActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerCreateCategory()
    return response.data
  },

  // Update a category
  async updateCategory(categoryId: string): Promise<CategoryActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerUpdateCategory({
      categoryId
    })
    return response.data
  },

  // Delete a category
  async deleteCategory(categoryId: string): Promise<CategoryActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerDeleteCategory({
      categoryId
    })
    return response.data
  },

  // Tag Management

  // Get tags for management
  async getTags(page?: number, limit?: number): Promise<TagListResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerGetTags({
      page,
      limit
    })
    return response.data
  },

  // Create a new tag
  async createTag(): Promise<TagActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerCreateTag()
    return response.data
  },

  // Update a tag
  async updateTag(tagId: string): Promise<TagActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerUpdateTag({
      tagId
    })
    return response.data
  },

  // Delete a tag
  async deleteTag(tagId: string): Promise<TagActionResponseDto> {
    const response = await blogManagementApiInstance.blogManagementControllerDeleteTag({
      tagId
    })
    return response.data
  }
}
