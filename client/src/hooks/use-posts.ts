import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  accounts?: Array<{ id: string; platform: string; handle?: string; avatarUrl?: string }>;
}

export interface CreatePostDto {
  accountIds: string[];
  content: string;
  mediaUrls?: string[];
  platformSettings?: Record<string, unknown>;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  scheduledAt?: Date;
}

export interface PostFilterOptions {
  status?: string;
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const usePosts = (filters?: PostFilterOptions) => {
  const queryClient = useQueryClient();

  const fetchPosts = async (): Promise<Post[]> => {
    const response = await apiClient.get('/posts', { params: filters });
    return response.data;
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', filters],
    queryFn: fetchPosts,
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      const apiError = error as any;
      toast.error(`Failed to delete post: ${apiError.response?.data?.error || error.message}`);
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostDto) => {
      const response = await apiClient.post('/posts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      const apiError = error as any; // Cast once to handle axios response structure
      toast.error(`Failed to create post: ${apiError.response?.data?.error || error.message}`);
    }
  });

  const publishPostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.post(`/posts/${postId}/publish`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post published successfully!');
    },
    onError: (error: Error) => {
      const apiError = error as any;
      toast.error(`Failed to publish post: ${apiError.response?.data?.error || error.message}`);
    }
  });

  const schedulePostMutation = useMutation({
    mutationFn: async ({ postId, scheduledAt }: { postId: string, scheduledAt: Date }) => {
      const response = await apiClient.post(`/posts/${postId}/schedule`, { scheduledAt });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post scheduled successfully!');
    },
    onError: (error: Error) => {
      const apiError = error as any;
      toast.error(`Failed to schedule post: ${apiError.response?.data?.error || error.message}`);
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreatePostDto>) => {
      const response = await apiClient.patch(`/posts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      const apiError = error as any
      toast.error(`Failed to update post: ${apiError.response?.data?.error || error.message}`);
    }
  });

  return {
    posts,
    isLoading,
    createPost: createPostMutation.mutateAsync,
    updatePost: updatePostMutation.mutateAsync,
    publishPost: publishPostMutation.mutateAsync,
    schedulePost: schedulePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isPublishing: publishPostMutation.isPending,
    isScheduling: schedulePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
};
