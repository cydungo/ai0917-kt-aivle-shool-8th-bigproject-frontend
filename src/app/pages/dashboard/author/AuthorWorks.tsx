import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, Book, FileText, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface Work {
  id: number;
  title: string;
  type: 'NOVEL' | 'SETTING';
  createdAt: string;
  updatedAt: string;
  status: string;
}

export function AuthorWorks() {
  const [activeTab, setActiveTab] = useState('novel');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // Fetch Works
  const { data: works, isLoading } = useQuery({
    queryKey: ['author', 'works'],
    queryFn: async () => {
      // API call to fetch works
      // Assuming GET /api/v1/author/works returns all works
      // If endpoint is different, it needs to be adjusted.
      // For now, mocking or assuming a standard endpoint.
      // If separate endpoints exist for novels and settings, we might need Promise.all
      try {
        const res = await apiClient.get('/api/v1/author/works');
        return res.data;
      } catch (e) {
        // Fallback or mock if API not ready
        return [];
      }
    },
  });

  const novels =
    works?.filter((w: Work) => w.type === 'NOVEL' || !w.type) || [];
  const settings = works?.filter((w: Work) => w.type === 'SETTING') || [];

  // Fetch Work Detail
  const { data: workDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['author', 'works', selectedWork?.id],
    queryFn: async () => {
      if (!selectedWork) return null;
      try {
        const res = await apiClient.get(
          `/api/v1/author/works/${selectedWork.id}`,
        );
        return res.data;
      } catch (e) {
        console.error('Failed to fetch work detail', e);
        // Fallback for demo if API fails
        return {
          ...selectedWork,
          content:
            '이 작품의 내용은 아직 불러올 수 없습니다. (API 연동 필요)\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        };
      }
    },
    enabled: !!selectedWork,
  });

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">작품 관리</h2>
          <p className="text-muted-foreground">
            원문과 설정집을 관리하고 새로운 작품을 집필합니다.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />새 작품 만들기
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="novel" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            원문 (Novel)
          </TabsTrigger>
          <TabsTrigger value="setting" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            설정집 (Setting)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="novel" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels.length > 0 ? (
              novels.map((work: Work) => (
                <Card
                  key={work.id}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleWorkClick(work)}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {work.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit logic
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete logic
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      최종 수정:{' '}
                      {format(new Date(work.updatedAt), 'yyyy.MM.dd HH:mm')}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                등록된 원문이 없습니다. 새 작품을 만들어보세요.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="setting" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.length > 0 ? (
              settings.map((work: Work) => (
                <Card
                  key={work.id}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleWorkClick(work)}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {work.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit logic
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete logic
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      최종 수정:{' '}
                      {format(new Date(work.updatedAt), 'yyyy.MM.dd HH:mm')}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                등록된 설정집이 없습니다.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Work Detail Modal */}
      <Dialog
        open={!!selectedWork}
        onOpenChange={(open) => !open && setSelectedWork(null)}
      >
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedWork?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 border rounded-md bg-muted/20 whitespace-pre-wrap">
            {isDetailLoading ? (
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-2 text-muted-foreground">불러오는 중...</p>
              </div>
            ) : workDetail?.content ? (
              workDetail.content
            ) : (
              <p className="text-muted-foreground text-center mt-20">
                작품 내용이 비어있습니다.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedWork(null)}>
              닫기
            </Button>
            <Button>편집 모드로 열기</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
