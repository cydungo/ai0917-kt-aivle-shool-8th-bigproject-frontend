export interface IPTrendStatisticsDto {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  lastGeneratedAt: string;
}

export interface IPTrendReportSimpleDto {
  id: number;
  fileName: string;
  createdAt: string;
  status: string;
  fileSize?: number;
}

export interface IPTrendDashboardDto {
  latestReport: IPTrendReportSimpleDto | null;
  statistics: IPTrendStatisticsDto;
  recentReports: IPTrendReportSimpleDto[];
}

// Keeping these for List API
export interface IPTrendReportDto {
  id: number;
  title: string;
  date: string;
  summary: string;
  color?: string;
  bgColor?: string;
}

export interface IPTrendPreviewDto {
  id: number;
  title: string;
  analysisDate: string;
  content: string;
  pdfUrl?: string;
}

export interface AuthorSummaryDto {
  totalAuthors: number;
  newAuthors: number;
  activeAuthors: number;
}

export interface ManagerAuthorDto {
  id: number;
  name: string;
  email: string;
  workCount: number;
  createdAt: string;
  status: string;
}

export interface ManagerAuthorDetailDto {
  id: number;
  name: string;
  email: string;
  gender?: string;
  birthYear?: string;
  birthday?: string;
  createdAt: string;
  lastLogin: string;
  recentWorks: {
    id: number;
    title: string;
    createdAt: string;
  }[];
}
