import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Loader2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { managerService } from '../../../services/managerService';
import { adminService } from '../../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ManagerHomeProps {
  onNavigate?: (menu: string) => void;
}

export function ManagerHome({ onNavigate }: ManagerHomeProps) {
  const navigate = useNavigate();

  // Notice State
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isNoticeDetailOpen, setIsNoticeDetailOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  // Fetch Admin Dashboard Summary for System Overview
  const { data: systemSummary, isLoading: isSystemLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: adminService.getDashboardSummary,
  });

  // Fetch DAU for Traffic Overview
  const { data: dauData } = useQuery({
    queryKey: ['admin', 'dashboard', 'dau'],
    queryFn: adminService.getDashboardDau,
  });

  // Fetch Notices
  const { data: noticesData } = useQuery({
    queryKey: ['notices', 'latest'],
    queryFn: () => adminService.getNotices(0, 5),
  });

  const notices = noticesData?.content || [];
  const currentNotice = notices[currentNoticeIndex];

  // Handlers
  const handleNextNotice = () => {
    if (notices.length === 0) return;
    setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
  };

  const handlePrevNotice = () => {
    if (notices.length === 0) return;
    setCurrentNoticeIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const handleNoticeClick = (notice: any) => {
    setSelectedNotice(notice);
    setIsNoticeDetailOpen(true);
  };

  // Calculate Growth Rate
  const growthRate =
    dauData?.today && dauData?.yesterday
      ? ((dauData.today - dauData.yesterday) / dauData.yesterday) * 100
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. 상단 시스템 현황 (System Health) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                승인 대기 제안
              </span>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isSystemLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                systemSummary?.totalUsers ?? 0
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              검토가 필요한 제안서
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                진행 중인 공모전
              </span>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isSystemLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                systemSummary?.activeSessions ?? 0
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              현재 접수 중인 행사
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                관리 중인 작가
              </span>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">
              {isSystemLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                systemSummary?.savedArtworks ?? 0
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              전담 멘토링 대상
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                오늘 방문자 (DAU)
              </span>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold">{dauData?.today ?? 0}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              <span
                className={
                  growthRate >= 0
                    ? 'text-red-500 font-medium'
                    : 'text-blue-500 font-medium'
                }
              >
                {growthRate >= 0 ? '+' : ''}
                {growthRate.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">어제 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 배너 위젯 섹션 (공지사항) */}
      <div className="grid grid-cols-1 gap-6">
        {/* 공지사항 위젯 */}
        <Card className="border-border relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Megaphone className="w-5 h-5 text-primary" />
              주요 공지사항
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[140px] flex flex-col justify-center relative">
            {currentNotice ? (
              <div
                className="space-y-2 px-8 transition-all duration-300 hover:opacity-80 cursor-pointer"
                onClick={() => handleNoticeClick(currentNotice)}
              >
                <Badge
                  variant={
                    currentNotice.category === 'URGENT'
                      ? 'destructive'
                      : 'default'
                  }
                  className="mb-1"
                >
                  {currentNotice.category === 'URGENT' ? '긴급' : '공지'}
                </Badge>
                <h3 className="text-lg font-bold line-clamp-1">
                  {currentNotice.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {currentNotice.content || '공지사항 내용을 확인하세요.'}
                </p>
                <span className="text-xs text-muted-foreground block mt-2">
                  {new Date(currentNotice.createdAt).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                등록된 공지사항이 없습니다.
              </div>
            )}

            {/* Navigation Arrows */}
            {notices.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevNotice}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 hover:bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextNotice}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notice Detail Dialog */}
      <Dialog open={isNoticeDetailOpen} onOpenChange={setIsNoticeDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>공지사항 상세</DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedNotice.category === 'URGENT'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {selectedNotice.category === 'URGENT' ? '긴급' : '공지'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedNotice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{selectedNotice.title}</h3>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {selectedNotice.content}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsNoticeDetailOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
