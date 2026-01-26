import { useState, useContext, useEffect } from 'react';
import { AuthorBreadcrumbContext } from './AuthorBreadcrumbContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Users,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Loader2,
  Share2,
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { authorService } from '../../../services/authorService';
import { IPProposalDto, IPMatchingDto } from '../../../types/author';
import { format } from 'date-fns';

interface AuthorIPExpansionProps {
  defaultTab?: string;
}

export function AuthorIPExpansion({
  defaultTab = 'proposals',
}: AuthorIPExpansionProps) {
  const { setBreadcrumbs, onNavigate } = useContext(AuthorBreadcrumbContext);

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const breadcrumbs: { label: string; onClick?: () => void }[] = [
      { label: '홈', onClick: () => onNavigate('home') },
      { label: 'IP 확장', onClick: () => setActiveTab('proposals') },
    ];

    if (activeTab === 'proposals') {
      breadcrumbs.push({ label: '제안서 검토' });
    } else if (activeTab === 'matching') {
      breadcrumbs.push({ label: '담당자 매칭' });
    }

    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, onNavigate, activeTab]);

  // Fetch Proposals
  const { data: proposals, isLoading: isProposalsLoading } = useQuery({
    queryKey: ['author', 'ip-proposals'],
    queryFn: authorService.getIPProposals,
  });

  // Fetch Matching
  const { data: matchings, isLoading: isMatchingsLoading } = useQuery({
    queryKey: ['author', 'ip-matching'],
    queryFn: authorService.getIPMatching,
  });

  const proposalList = (proposals as unknown as IPProposalDto[]) || [];
  const matchingList = (matchings as unknown as IPMatchingDto[]) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Share2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">IP 확장</h1>
            <p className="text-sm text-muted-foreground">
              내 작품의 OSMU(One Source Multi Use) 제안서를 검토하고 담당자와
              매칭합니다.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="proposals">제안서 검토</TabsTrigger>
          <TabsTrigger value="matching">담당자 매칭</TabsTrigger>
        </TabsList>

        {/* 제안서 검토 탭 */}
        <TabsContent value="proposals" className="mt-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="제안서 검색..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" /> 필터
            </Button>
          </div>

          {isProposalsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {proposalList.length > 0 ? (
                proposalList.map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant={
                            proposal.status === 'PENDING'
                              ? 'default'
                              : 'secondary'
                          }
                          className="mb-2"
                        >
                          {proposal.statusDescription}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {proposal.receivedAt
                            ? format(
                                new Date(proposal.receivedAt),
                                'yyyy.MM.dd',
                              )
                            : '-'}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {proposal.title}
                      </CardTitle>
                      <CardDescription>{proposal.sender}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
                        {proposal.content}
                      </div>
                      <Button variant="ghost" className="w-full text-xs h-8">
                        상세 보기 <ChevronRight className="ml-1 w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  도착한 제안서가 없습니다.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* 담당자 매칭 탭 */}
        <TabsContent value="matching" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>매칭 현황</CardTitle>
              <CardDescription>
                현재 진행 중인 담당자 매칭 현황입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMatchingsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-8">
                  {matchingList.length > 0 ? (
                    matchingList.map((match) => (
                      <div
                        key={match.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {match.managerName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {match.department} | {match.role}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {(match.tags || []).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>
                              {match.matchedAt
                                ? format(
                                    new Date(match.matchedAt),
                                    'yyyy.MM.dd',
                                  )
                                : '-'}{' '}
                              매칭됨
                            </span>
                          </div>
                          <Button size="sm">메시지 보내기</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      진행 중인 매칭이 없습니다.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
