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
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface ManagerHomeProps {
  onNavigate?: (menu: string) => void;
}

export function ManagerHome({ onNavigate }: ManagerHomeProps) {
  const navigate = useNavigate();

  // Notice State
  const [isNoticeDetailOpen, setIsNoticeDetailOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  // Manager Dashboard Page (summary + notices)
  const { data: pageData } = useQuery({
    queryKey: ['manager', 'dashboard', 'page'],
    queryFn: managerService.getDashboardPage,
  });
  const summary = pageData?.summary;
  const notices = pageData?.notices || [];
  const currentNotice =
    notices.length > 0 ? notices[currentNoticeIndex] : null;

  // Handlers
  const handleNoticeClick = (notice: any) => {
    setSelectedNotice(notice);
    setIsNoticeDetailOpen(true);
  };

  const handleNextNotice = () => {
    if (notices.length === 0) return;
    setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
  };

  const handlePrevNotice = () => {
    if (notices.length === 0) return;
    setCurrentNoticeIndex(
      (prev) => (prev - 1 + notices.length) % notices.length,
    );
  };

  const growthRate = summary?.dauChangeRate ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 상단 요약 카드: 관리 작가, DAU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              관리 중인 작가
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.managedAuthors ?? 0}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 담당하고 있는 작가 수
            </p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              접속자 현황 (DAU)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <div className="text-2xl font-bold">
                {summary?.todayDau ?? 0}
              </div>
              <span className="text-xs text-muted-foreground">
                전일 {summary?.yesterdayDau ?? 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              증감률 {growthRate > 0 ? '+' : ''}
              {Math.round((growthRate ?? 0) * 10) / 10}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 공지사항 섹션 (Author 홈 디자인과 통일) */}
      <div className="grid grid-cols-1 gap-6">
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
                <Badge variant="default" className="mb-1">
                  공지
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
                  <Badge variant="default">공지</Badge>
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
