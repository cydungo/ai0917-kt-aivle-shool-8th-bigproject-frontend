import apiClient from '../api/axios';
import {
  AuthorDashboardSummaryDto,
  AuthorMyPageDto,
  AuthorNoticeDto,
  ExtractSettingRequest,
  ExtractSettingResponse,
  IPMatchingDto,
  IPProposalDto,
  LorebookDto,
  LorebookCharacterDto,
  LorebookWorldviewDto,
  LorebookPlotDto,
  LorebookPlaceDto,
  LorebookItemDto,
  LorebookGroupDto,
  LorebookSimilarityRequestDto,
  WorkCreateRequestDto,
  WorkResponseDto,
  WorkStatus,
  WorkUpdateRequestDto,
  EpisodeDto,
  EpisodeDetailDto,
  KeywordExtractionRequestDto,
  KeywordExtractionResponseDto,
  PublishAnalysisRequestDto,
  PublishAnalysisResponseDto,
  AuthorManagerResponseDto,
} from '../types/author';
import { PageResponse } from '../types/common';
import { AuthMeResponse } from '../types/auth';

export const authorService = {
  // AI Service
  extractSettings: async (data: ExtractSettingRequest) => {
    // Redirected to Backend
    const response = await apiClient.post<ExtractSettingResponse>(
      '/api/v1/ai/author/episodes/novel_save',
      data,
    );
    return response.data;
  },

  // Dashboard
  getDashboardSummary: async (integrationId: string) => {
    const response = await apiClient.get<AuthorDashboardSummaryDto>(
      '/api/v1/author/dashboard/summary',
      { params: { integrationId } },
    );
    return response.data;
  },

  getDashboardNotices: async (page = 0, size = 5) => {
    const response = await apiClient.get<PageResponse<AuthorNoticeDto>>(
      '/api/v1/author/dashboard/notice',
      { params: { page, size } },
    );
    return response.data;
  },

  // Works
  getWorks: async (integrationId: string) => {
    // CSV defines /api/v1/author/works
    // integrationId might not be needed if session is used, or as query param
    const response = await apiClient.get<WorkResponseDto[]>(
      '/api/v1/author/works',
    );
    return response.data;
  },

  getWorkDetail: async (workId: string) => {
    const response = await apiClient.get<WorkResponseDto>(
      `/api/v1/author/works/${workId}`,
    );
    return response.data;
  },

  getEpisodes: async (workId: string) => {
    const response = await apiClient.get<EpisodeDto[]>(
      `/api/v1/author/works/${workId}/episodes`,
    );
    return response.data;
  },

  getEpisodeDetail: async (workId: string, episodeId: string) => {
    const response = await apiClient.get<EpisodeDetailDto>(
      `/api/v1/author/works/${workId}/episodes/${episodeId}`,
    );
    return response.data;
  },

  createEpisode: async (workId: string, title: string, subtitle?: string) => {
    const response = await apiClient.post<EpisodeDto>(
      `/api/v1/author/works/${workId}/episodes`,
      { title, subtitle },
    );
    return response.data;
  },

  updateEpisode: async (
    workId: string,
    episodeId: string,
    content: string,
    title?: string,
  ) => {
    const response = await apiClient.put<EpisodeDetailDto>(
      `/api/v1/author/works/${workId}/episodes/${episodeId}`,
      { content, title },
    );
    return response.data;
  },

  updateEpisodeTitle: async (
    workId: string,
    episodeId: string,
    title: string,
  ) => {
    const response = await apiClient.patch<EpisodeDetailDto>(
      `/api/v1/author/works/${workId}/episodes/${episodeId}`,
      { title },
    );
    return response.data;
  },

  deleteEpisode: async (workId: string, episodeId: string) => {
    await apiClient.delete(
      `/api/v1/author/works/${workId}/episodes/${episodeId}`,
    );
  },

  publishEpisode: async (workId: string, episodeId: string) => {
    const response = await apiClient.post(
      `/api/v1/author/works/${workId}/episodes/${episodeId}/publish`,
    );
    return response.data;
  },

  getEpisodeCategories: async (episodeId: string) => {
    // Redirected to Backend
    const response = await apiClient.post<KeywordExtractionResponseDto>(
      `/api/v1/ai/author/categories`,
      { episodeId },
    );
    return response.data;
  },

  publishAnalysis: async (workId: string, data: PublishAnalysisRequestDto) => {
    // Redirected to Backend
    const response = await apiClient.post<PublishAnalysisResponseDto>(
      `/api/v1/ai/author/setting`,
      { workId, ...data },
    );
    return response.data;
  },

  searchLorebookSimilarity: async (
    workId: string,
    data: LorebookSimilarityRequestDto,
  ) => {
    // Note: User requested POST /api/v1/author/lorebooks/{id}/userQ
    // Assuming {id} refers to workId or a specific lorebook container ID.
    // Based on "search for lorebook entries", likely workId.
    const response = await apiClient.post<any[]>(
      `/api/v1/author/lorebooks/${workId}/userQ`,
      data,
    );
    return response.data;
  },

  publishConfirm: async (workId: string) => {
    const response = await apiClient.post(
      `/api/v1/author/works/${workId}/publish/confirm`,
    );
    return response.data;
  },

  createWork: async (data: WorkCreateRequestDto) => {
    const response = await apiClient.post<number>('/api/v1/author/works', data);
    return response.data;
  },

  updateWork: async (id: number, data: WorkUpdateRequestDto) => {
    const response = await apiClient.patch<number>(
      `/api/v1/author/works/${id}`,
      data,
    );
    return response.data;
  },

  updateWorkStatus: async (id: number, status: WorkStatus) => {
    const response = await apiClient.patch<number>(
      `/api/v1/author/works/${id}/status`,
      null,
      { params: { status } },
    );
    return response.data;
  },

  deleteWork: async (id: number) => {
    await apiClient.delete(`/api/v1/author/works/${id}`);
  },

  // Lorebooks (Settings)
  getLorebooks: async () => {
    const response = await apiClient.get<LorebookDto[]>(
      '/api/v1/author/lorebook',
    );
    return response.data;
  },

  getLorebookCharacters: async (workId: string) => {
    const response = await apiClient.get<LorebookCharacterDto[]>(
      `/api/v1/author/lorebook/${workId}/characters`,
    );
    return response.data;
  },

  getLorebookWorldviews: async (workId: string) => {
    const response = await apiClient.get<LorebookWorldviewDto[]>(
      `/api/v1/author/lorebook/${workId}/worldview`,
    );
    return response.data;
  },

  getLorebookPlots: async (workId: string) => {
    const response = await apiClient.get<LorebookPlotDto[]>(
      `/api/v1/author/lorebook/${workId}/plot`,
    );
    return response.data;
  },

  getLorebookPlaces: async (workId: string) => {
    const response = await apiClient.get<LorebookPlaceDto[]>(
      `/api/v1/author/lorebook/${workId}/places`,
    );
    return response.data;
  },

  getLorebookItems: async (workId: string) => {
    const response = await apiClient.get<LorebookItemDto[]>(
      `/api/v1/author/lorebook/${workId}/items`,
    );
    return response.data;
  },

  getLorebookGroups: async (workId: string) => {
    const response = await apiClient.get<LorebookGroupDto[]>(
      `/api/v1/author/lorebook/${workId}/groups`,
    );
    return response.data;
  },

  // Lorebook Mutations (Generic-like pattern for simplicity in service, though specific in implementation)
  createLorebookEntry: async (workId: string, category: string, data: any) => {
    // category: characters, places, items, groups, worldview, plot
    // Mapping category to endpoint path component
    const pathMap: Record<string, string> = {
      characters: 'characters',
      places: 'places',
      items: 'items',
      groups: 'groups',
      worldviews: 'worldview',
      plots: 'plot',
    };
    const path = pathMap[category];
    if (!path) throw new Error(`Invalid category: ${category}`);

    const response = await apiClient.post(
      `/api/v1/author/lorebook/${workId}/${path}`,
      data,
    );
    return response.data;
  },

  updateLorebookEntry: async (
    workId: string,
    category: string,
    id: number,
    data: any,
  ) => {
    const pathMap: Record<string, string> = {
      characters: 'characters',
      places: 'places',
      items: 'items',
      groups: 'groups',
      worldviews: 'worldview',
      plots: 'plot',
    };
    const path = pathMap[category];
    if (!path) throw new Error(`Invalid category: ${category}`);

    const response = await apiClient.put(
      `/api/v1/author/lorebook/${workId}/${path}/${id}`,
      data,
    );
    return response.data;
  },

  deleteLorebookEntry: async (workId: string, category: string, id: number) => {
    const pathMap: Record<string, string> = {
      characters: 'characters',
      places: 'places',
      items: 'items',
      groups: 'groups',
      worldviews: 'worldview',
      plots: 'plot',
    };
    const path = pathMap[category];
    if (!path) throw new Error(`Invalid category: ${category}`);

    await apiClient.delete(`/api/v1/author/lorebook/${workId}/${path}/${id}`);
  },

  searchLorebook: async (workId: string, category: string, query: string) => {
    const response = await apiClient.get<any[]>(
      `/api/v1/author/lorebook/${workId}/search`,
      { params: { category, query } },
    );
    return response.data;
  },

  exportLorebook: async (workId: string) => {
    const response = await apiClient.get(
      `/api/v1/author/lorebook/${workId}/export`,
      { responseType: 'blob' },
    );
    return response.data;
  },

  // IP Expansion
  getIPProposals: async () => {
    const response = await apiClient.get<IPProposalDto[]>(
      '/api/v1/author/ip-expansion/proposals',
    );
    return response.data;
  },

  getIPMatching: async () => {
    const response = await apiClient.get<IPMatchingDto[]>(
      '/api/v1/author/ip-expansion/matching',
    );
    return response.data;
  },

  // Author ID Code Generation (Author-Manager linkage)
  generateAuthorCode: async () => {
    const response = await apiClient.post('/api/v1/author/manager/code');
    const data = response.data;

    // Check if data is an object and has 'code' property
    if (data && typeof data === 'object' && 'code' in data) {
      return String(data.code);
    }

    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  },

  // Get My Manager Info
  getMyManager: async () => {
    const response = await apiClient.get<AuthorManagerResponseDto>(
      '/api/v1/author/manager',
    );
    return response.data;
  },

  // My Page
  getMyPage: async () => {
    const response = await apiClient.get<AuthMeResponse>(`/api/v1/auth/me`);
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await apiClient.post(`/api/v1/auth/password/reset`, data);
    return response.data;
  },
};
