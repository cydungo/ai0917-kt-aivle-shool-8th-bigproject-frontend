import { useState } from 'react';
import {
  Users,
  Globe,
  BookOpen,
  Plus,
  Settings,
  Sparkles,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
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
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { cn } from '../../../components/ui/utils';
import { useQuery } from '@tanstack/react-query';
import { authorService } from '../../../services/authorService';
import {
  LorebookCharacterDto,
  LorebookWorldviewDto,
  LorebookPlotDto,
} from '../../../types/author';

interface AuthorLorebookPanelProps {
  workId: number;
  className?: string;
}

export function AuthorLorebookPanel({
  workId,
  className,
}: AuthorLorebookPanelProps) {
  // Fetch Lorebook/Work details
  const { data: work } = useQuery({
    queryKey: ['author', 'work', workId],
    queryFn: () => authorService.getWorkDetail(workId.toString()),
  });

  // Fetch Characters
  const { data: characters, isLoading: isCharactersLoading } = useQuery<
    LorebookCharacterDto[]
  >({
    queryKey: ['author', 'work', workId, 'characters'],
    queryFn: () => authorService.getLorebookCharacters(workId.toString()),
  });

  // Fetch Worldviews
  const { data: worldviews, isLoading: isWorldviewsLoading } = useQuery<
    LorebookWorldviewDto[]
  >({
    queryKey: ['author', 'work', workId, 'worldviews'],
    queryFn: () => authorService.getLorebookWorldviews(workId.toString()),
  });

  // Fetch Plots
  const { data: plots, isLoading: isPlotsLoading } = useQuery<
    LorebookPlotDto[]
  >({
    queryKey: ['author', 'work', workId, 'plots'],
    queryFn: () => authorService.getLorebookPlots(workId.toString()),
  });

  return (
    <div
      className={cn(
        'flex flex-col h-full border-l border-border bg-card/50',
        className,
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-500" />
          설정집
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="AI 재분석"
          >
            <Sparkles className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="내보내기"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="p-3 border-b border-border bg-muted/20">
        <h4 className="text-xs font-medium text-muted-foreground mb-1">
          현재 작품
        </h4>
        <p className="text-sm font-bold truncate">
          {work?.title || '작품 로딩 중...'}
        </p>
      </div>

      <Tabs defaultValue="characters" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-10">
          <TabsTrigger
            value="characters"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10 text-xs"
          >
            <Users className="w-3 h-3 mr-1" /> 인물
          </TabsTrigger>
          <TabsTrigger
            value="worldview"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10 text-xs"
          >
            <Globe className="w-3 h-3 mr-1" /> 세계관
          </TabsTrigger>
          <TabsTrigger
            value="plot"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10 text-xs"
          >
            <BookOpen className="w-3 h-3 mr-1" /> 서사
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="characters" className="mt-0 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                등장인물 목록
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {isCharactersLoading ? (
              <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center">
                <Loader2 className="w-4 h-4 mb-2 animate-spin" />
                불러오는 중...
              </div>
            ) : characters && characters.length > 0 ? (
              characters.map((char) => (
                <Card
                  key={char.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors border-border/60 mb-3"
                >
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-bold flex justify-between items-center">
                      {char.name}
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 px-1"
                      >
                        {char.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {char.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {char.traits?.map((trait, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                등록된 인물이 없습니다.
              </div>
            )}
          </TabsContent>

          <TabsContent value="worldview" className="mt-0 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                세계관 설정 목록
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {isWorldviewsLoading ? (
              <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center">
                <Loader2 className="w-4 h-4 mb-2 animate-spin" />
                불러오는 중...
              </div>
            ) : worldviews && worldviews.length > 0 ? (
              worldviews.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors border-border/60 mb-3"
                >
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-bold flex justify-between items-center">
                      {item.title}
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1 border-primary/50 text-primary"
                      >
                        {item.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                등록된 세계관 설정이 없습니다.
              </div>
            )}
          </TabsContent>

          <TabsContent value="plot" className="mt-0 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                주요 사건(플롯) 목록
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {isPlotsLoading ? (
              <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center">
                <Loader2 className="w-4 h-4 mb-2 animate-spin" />
                불러오는 중...
              </div>
            ) : plots && plots.length > 0 ? (
              plots.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors border-border/60 mb-3"
                >
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-xs font-bold flex justify-between items-center">
                      <span className="truncate flex-1">{item.title}</span>
                      <Badge
                        variant={
                          item.importance === 'Main' ? 'default' : 'secondary'
                        }
                        className="text-[10px] h-4 px-1 ml-2 shrink-0"
                      >
                        {item.importance || 'Sub'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[9px] h-3 px-1">
                        Order: {item.order}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                등록된 서사(플롯)가 없습니다.
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
