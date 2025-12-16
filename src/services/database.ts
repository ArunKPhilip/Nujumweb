import { supabase } from '../lib/supabase';
import type {
  CommunityPost,
  CommunityComment,
  BenefitProgram,
  AssistiveDevice,
  ServiceRequest,
  Document,
  User
} from '../types';

// Community Services
export const communityService = {
  // Get all community posts with user information
  async getPosts(): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        users:users(id, username, profile_picture)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(post => ({
      id: post.id,
      userId: post.user_id,
      user: {
        id: post.users?.id || '',
        username: post.users?.username || '',
        profilePicture: post.users?.profile_picture || ''
      },
      content: post.content,
      mediaUrls: post.media_urls || [],
      likes: post.likes || [],
      comments: [], // We'll load comments separately if needed
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    })) || [];
  },

  // Create a new post
  async createPost(userId: string, content: string, mediaUrls?: string[]): Promise<CommunityPost> {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        content,
        media_urls: mediaUrls,
      })
      .select(`
        *,
        users:users(id, username, profile_picture)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      user: {
        id: data.users?.id || '',
        username: data.users?.username || '',
        profilePicture: data.users?.profile_picture || ''
      },
      content: data.content,
      mediaUrls: data.media_urls || [],
      likes: data.likes || [],
      comments: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Like/unlike a post
  async toggleLike(postId: string, userId: string): Promise<void> {
    // Get current likes
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;

    const currentLikes = post.likes || [];
    const isLiked = currentLikes.includes(userId);

    const updatedLikes = isLiked
      ? currentLikes.filter((id: string) => id !== userId)
      : [...currentLikes, userId];

    const { error } = await supabase
      .from('community_posts')
      .update({ likes: updatedLikes })
      .eq('id', postId);

    if (error) throw error;
  },
};

// Programs Services
export const programsService = {
  // Get all benefit programs
  async getPrograms(): Promise<BenefitProgram[]> {
    const { data, error } = await supabase
      .from('benefit_programs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(program => ({
      id: program.id,
      title: program.title,
      description: program.description,
      type: program.type as 'government' | 'private',
      category: program.category,
      eligibility: program.eligibility || [],
      benefits: program.benefits || [],
      applicationUrl: program.application_url || undefined,
      deadline: program.deadline || undefined,
      isActive: program.is_active,
      createdAt: program.created_at,
    })) || [];
  },
};

// Service Requests Services
export const serviceRequestService = {
  // Get user's service requests
  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(request => ({
      id: request.id,
      userId: request.user_id,
      type: request.type as any,
      title: request.title,
      description: request.description,
      urgency: request.urgency as any,
      location: request.location,
      status: request.status as any,
      assignedTo: request.assigned_to || undefined,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
      completedAt: request.completed_at || undefined,
    })) || [];
  },

  // Create a new service request
  async createRequest(requestData: Omit<ServiceRequest, 'id' | 'status' | 'assignedTo' | 'createdAt' | 'updatedAt' | 'completedAt'>): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id: requestData.userId,
        type: requestData.type,
        title: requestData.title,
        description: requestData.description,
        urgency: requestData.urgency,
        location: requestData.location,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as any,
      title: data.title,
      description: data.description,
      urgency: data.urgency as any,
      location: data.location,
      status: data.status as any,
      assignedTo: data.assigned_to || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at || undefined,
    };
  },
};

// Document Services
export const documentService = {
  // Get user's documents
  async getUserDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return data?.map(doc => ({
      id: doc.id,
      userId: doc.user_id,
      type: doc.type as any,
      fileName: doc.file_name,
      fileUrl: doc.file_url,
      status: doc.status as any,
      uploadedAt: doc.uploaded_at,
      verifiedAt: doc.verified_at || undefined,
      rejectionReason: doc.rejection_reason || undefined,
    })) || [];
  },

  // Upload a document
  async uploadDocument(documentData: Omit<Document, 'id' | 'uploadedAt' | 'verifiedAt' | 'rejectionReason'>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: documentData.userId,
        type: documentData.type,
        file_name: documentData.fileName,
        file_url: documentData.fileUrl,
        status: documentData.status || 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type as any,
      fileName: data.file_name,
      fileUrl: data.file_url,
      status: data.status as any,
      uploadedAt: data.uploaded_at,
      verifiedAt: data.verified_at || undefined,
      rejectionReason: data.rejection_reason || undefined,
    };
  },
};

// Marketplace Services
export const marketplaceService = {
  // Get all assistive devices
  async getDevices(): Promise<AssistiveDevice[]> {
    const { data, error } = await supabase
      .from('assistive_devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // For now, we'll need to join with vendors table when it's implemented
    return data?.map(device => ({
      id: device.id,
      name: device.name,
      description: device.description,
      category: device.category,
      price: device.price,
      currency: device.currency,
      vendor: {
        id: device.vendor_id,
        name: 'Vendor Name', // Placeholder - would need vendors table
        contact: 'contact@example.com',
      },
      images: device.images || [],
      specifications: device.specifications || {},
      reviews: [], // Would need reviews table
      subsidies: undefined, // Would need subsidies logic
    })) || [];
  },
};
