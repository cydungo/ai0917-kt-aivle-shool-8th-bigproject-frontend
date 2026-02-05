import { useState } from 'react';
import {
  Users,
  Globe,
  BookOpen,
  Plus,
  Settings,
  Download,
  MapPin,
  Package,
  Users2,
  Search,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { cn } from '../../../components/ui/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorService } from '../../../services/authorService';
import { toast } from 'sonner';

import { Checkbox } from '../../../components/ui/checkbox';

interface AuthorLorebookPanelProps {
  workId: number;
  userId: string;
  className?: string;
}

type Category =
  | 'characters'
  | 'places'
  | 'items'
  | 'groups'
  | 'worldviews'
  | 'plots';

const toBackendCategory = (cat: string): string => {
  const map: Record<string, string> = {
    characters: '인물',
    places: '장소',
    items: '물건',
    groups: '단체',
    worldviews: '세계',
    plots: '사건',
    all: '*',
  };
  return map[cat] || cat;
};

export function AuthorLorebookPanel({
  workId,
  userId,
  className,
}: AuthorLorebookPanelProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('characters');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>(
    'keyword',
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // If null, it's create mode

  // Similarity Check States
  const [isSimilarityCheckOpen, setIsSimilarityCheckOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  const [similaritySearchResults, setSimilaritySearchResults] = useState<any[]>(
    [],
  );
  const [isConfirmed, setIsConfirmed] = useState(false);

  const queryClient = useQueryClient();

  // Fetch Lorebook/Work details
  const { data: work } = useQuery({
    queryKey: ['author', 'work', workId],
    queryFn: () => authorService.getWorkDetail(workId.toString()),
  });

  // Fetch Manuscript count (Replaces Episode count)
  const { data: manuscriptsPage } = useQuery({
    queryKey: ['author', 'manuscripts', workId],
    queryFn: () =>
      authorService.getManuscripts(userId, work!.title, 0, 1000, workId), // Fetch mostly all to count
    enabled: !!work?.title && !!userId,
  });
  const manuscriptCount = manuscriptsPage?.totalElements || 0;

  // Fetch Data based on category (Unified)
  const { data: lorebooks } = useQuery({
    queryKey: ['author', 'lorebook', userId, work?.title, activeCategory],
    queryFn: () =>
      authorService.getLorebooksByCategory(
        userId,
        work!.title,
        activeCategory,
        workId,
      ),
    enabled: !!work?.title && !!userId,
  });

  const displayItems =
    lorebooks?.map((item) => {
      let parsedSettings = {};
      try {
        // item.setting is JsonNode (any), which can be an object or a JSON string depending on serialization
        if (item.setting && typeof item.setting === 'object') {
          parsedSettings = item.setting;
        } else if (typeof item.setting === 'string') {
          parsedSettings = JSON.parse(item.setting);
        }
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
      return {
        ...item,
        name: item.keyword || '',
        title: item.keyword || '',
        description: (parsedSettings as any).description || '',
        ...parsedSettings,
      };
    }) || [];

  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const { name, title, description, subtitle, ...rest } = data;
      const lorebookTitle = name || title;
      const settingsObj = { description, ...rest };
      const settings = JSON.stringify(settingsObj);

      return authorService.saveLorebookManual(userId, work!.title, workId, {
        keyword: lorebookTitle,
        subtitle: subtitle || '',
        settings,
        category: toBackendCategory(activeCategory) as any,
        episode: [],
      });
    },
    onSuccess: () => {
      toast.success('생성되었습니다.');
      setIsEditOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['author', 'lorebook', userId, work?.title, activeCategory],
      });
    },
    onError: () => toast.error('생성에 실패했습니다.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      const { name, title, description, subtitle, ...rest } = data;
      const lorebookTitle = name || title;
      const settingsObj = { description, ...rest };
      const settings = JSON.stringify(settingsObj);

      return authorService.updateLorebook(
        userId,
        work!.title,
        activeCategory,
        id,
        {
          keyword: lorebookTitle,
          subtitle: subtitle || '',
          settings,
        },
      );
    },
    onSuccess: () => {
      toast.success('수정되었습니다.');
      setIsEditOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['author', 'lorebook', userId, work?.title, activeCategory],
      });
    },
    onError: () => toast.error('수정에 실패했습니다.'),
  });

  const handleCreateClick = () => {
    setEditingItem({});
    setIsEditOpen(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem({ ...item });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      authorService.deleteLorebook(userId, work!.title, activeCategory, id),
    onSuccess: () => {
      toast.success('삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['author', 'lorebook', userId, work?.title, activeCategory],
      });
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });

  const searchMutation = useMutation({
    mutationFn: ({ category, query }: { category: string; query: string }) =>
      authorService.searchLorebookSimilarity(userId, work!.title, {
        category: toBackendCategory(category) as any,
        user_query: query,
        user_id: userId,
        work_id: workId,
        sim: 0.7, // Default threshold
        limit: 5, // Default topK
      }),
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: () => toast.error('검색에 실패했습니다.'),
  });

  const checkSimilarityMutation = useMutation({
    mutationFn: ({ category, query }: { category: string; query: string }) =>
      authorService.searchLorebookSimilarity(userId, work!.title, {
        category: toBackendCategory('all') as any, // Always check against all
        user_query: query,
        user_id: userId,
        work_id: workId,
        sim: 0.6,
        limit: 5,
      }),
    onSuccess: (data) => {
      setSimilaritySearchResults(data);
      setIsSimilarityCheckOpen(true);
      setIsConfirmed(false);
    },
    onError: () => toast.error('유사도 검사에 실패했습니다.'),
  });

  const keywordSearchMutation = useMutation({
    mutationFn: async ({
      category,
      query,
    }: {
      category: string;
      query: string;
    }) => {
      // For keyword search, we fetch all and filter locally or use a search API if available.
      // Current implementation fetches by category and filters.
      // If we need to send Korean category to backend for fetching:
      // But getLorebooksByCategory likely takes English 'characters' if it maps to folder/DB type.
      // Wait, user said "category selection... send '인물' as is".
      // I'll stick to what I know: The LISTING API might still use English if it hasn't changed.
      // Only the SEARCH/CREATE APIs were explicitly mentioned.
      // I will proceed with fetching using `activeCategory` (English) for listing.

      let data: any[] = [];
      if (category === 'all') {
        data = await authorService.getLorebooks(userId, work!.title, workId);
      } else {
        data = await authorService.getLorebooksByCategory(
          userId,
          work!.title,
          category,
          workId,
        );
      }

      const lowerQuery = query.toLowerCase();
      return data
        .map((item) => {
          let parsedSettings = {};
          try {
            if (item.setting && typeof item.setting === 'object') {
              parsedSettings = item.setting;
            } else if (typeof item.setting === 'string') {
              parsedSettings = JSON.parse(item.setting);
            }
          } catch (e) {
            console.error('Failed to parse settings', e);
          }
          return {
            ...item,
            name: item.keyword || '',
            title: item.keyword || '',
            description: (parsedSettings as any).description || '',
            ...parsedSettings,
          };
        })
        .filter((item) => {
          const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
          const descMatch = item.description
            ?.toLowerCase()
            .includes(lowerQuery);
          const titleMatch = item.title?.toLowerCase().includes(lowerQuery);
          return nameMatch || descMatch || titleMatch;
        });
    },
    onSuccess: (data) => {
      setSearchResults(data);
      if (data.length === 0) {
        toast.info('검색 결과가 없습니다.');
      }
    },
    onError: () => toast.error('검색에 실패했습니다.'),
  });

  const exportMutation = useMutation({
    mutationFn: () => authorService.exportLorebook(workId.toString()), // This also might need update
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${work?.title || 'work'}_설정집.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('설정집이 다운로드되었습니다.');
    },
    onError: () => toast.error('내보내기에 실패했습니다.'),
  });

  const handleExport = () => {
    if (confirm('설정집을 Markdown 파일로 다운로드하시겠습니까?')) {
      exportMutation.mutate();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    if (searchMode === 'keyword') {
      keywordSearchMutation.mutate({
        category: activeCategory,
        query: searchQuery,
      });
    } else {
      searchMutation.mutate({ category: activeCategory, query: searchQuery });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData as any);

    // Process tags/arrays
    if (activeCategory === 'characters' && data.traits) {
      data.traits = (data.traits as string)
        .split(',')
        .map((s) => s.trim()) as any;
    }
    if (activeCategory === 'worldviews' && data.tags) {
      data.tags = (data.tags as string).split(',').map((s) => s.trim()) as any;
    }
    if (activeCategory === 'groups' && data.members) {
      data.members = (data.members as string)
        .split(',')
        .map((s) => s.trim()) as any;
    }
    if (activeCategory === 'plots' && data.participants) {
      data.participants = (data.participants as string)
        .split(',')
        .map((s) => s.trim()) as any;
    }

    setPendingSaveData(data);

    // Perform Similarity Check before saving
    // Use name or title or description as query
    const query = data.name || data.title || data.description || '';
    checkSimilarityMutation.mutate({ category: 'all', query });
  };

  const handleConfirmSave = () => {
    if (!pendingSaveData) return;

    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: pendingSaveData });
    } else {
      createMutation.mutate(pendingSaveData);
    }
    setIsSimilarityCheckOpen(false);
    setIsConfirmed(false);
    setPendingSaveData(null);
  };

  const categories: { id: Category; label: string }[] = [
    { id: 'characters', label: '인물' },
    { id: 'places', label: '장소' },
    { id: 'items', label: '물건' },
    { id: 'groups', label: '집단' },
    { id: 'worldviews', label: '세계' },
    { id: 'plots', label: '사건' },
  ];

  const renderContent = () => {
    let content = null;
    const commonProps = {
      onEdit: handleEditClick,
      onDelete: handleDeleteClick,
    };

    const items = displayItems.slice().sort((a, b) => b.id - a.id) as any[];

    if (!items || items.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          데이터가 없습니다.
        </div>
      );
    }

    switch (activeCategory) {
      case 'characters':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.name}
            description={item.description}
            tags={[item.role, item.age].filter(Boolean) as string[]}
            {...commonProps}
          />
        ));
        break;
      case 'places':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.name}
            description={item.description}
            tags={[item.location].filter(Boolean) as string[]}
            {...commonProps}
          />
        ));
        break;
      case 'items':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.name}
            description={item.description}
            tags={[item.type].filter(Boolean) as string[]}
            {...commonProps}
          />
        ));
        break;
      case 'groups':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.name}
            description={item.description}
            {...commonProps}
          />
        ));
        break;
      case 'worldviews':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.title} // Worldview uses title
            description={item.description}
            tags={[item.category]}
            {...commonProps}
          />
        ));
        break;
      case 'plots':
        content = items.map((item) => (
          <LorebookCard
            key={item.id}
            item={item}
            title={item.title} // Plot uses title
            description={item.description}
            tags={[item.importance].filter(Boolean) as string[]}
            {...commonProps}
          />
        ));
        break;
    }

    return content;
  };

  const renderFormFields = () => {
    switch (activeCategory) {
      case 'characters':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">부제/별칭</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingItem?.subtitle}
                  placeholder="별명이나 이명 등"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <Input id="age" name="age" defaultValue={editingItem?.age} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Input
                  id="gender"
                  name="gender"
                  defaultValue={editingItem?.gender}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">직업</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  defaultValue={editingItem?.occupation}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Input
                id="role"
                name="role"
                defaultValue={editingItem?.role}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appearance">외모 묘사</Label>
              <Textarea
                id="appearance"
                name="appearance"
                defaultValue={editingItem?.appearance}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personality">성격</Label>
              <Textarea
                id="personality"
                name="personality"
                defaultValue={editingItem?.personality}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traits">특징 (쉼표로 구분)</Label>
              <Input
                id="traits"
                name="traits"
                defaultValue={editingItem?.traits?.join(', ')}
              />
            </div>
          </>
        );
      case 'places':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">부제/별칭</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingItem?.subtitle}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingItem?.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale">규모</Label>
                <Input
                  id="scale"
                  name="scale"
                  defaultValue={editingItem?.scale}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="atmosphere">분위기</Label>
              <Input
                id="atmosphere"
                name="atmosphere"
                defaultValue={editingItem?.atmosphere}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="function">기능/용도</Label>
              <Input
                id="function"
                name="function"
                defaultValue={editingItem?.function}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">소유자/관리자</Label>
              <Input
                id="owner"
                name="owner"
                defaultValue={editingItem?.owner}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">역사/배경</Label>
              <Textarea
                id="history"
                name="history"
                defaultValue={editingItem?.history}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
          </>
        );
      case 'items':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">부제/별칭</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingItem?.subtitle}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">종류</Label>
                <Input id="type" name="type" defaultValue={editingItem?.type} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">등급/가치</Label>
                <Input id="rank" name="rank" defaultValue={editingItem?.rank} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="effect">효과/능력</Label>
              <Input
                id="effect"
                name="effect"
                defaultValue={editingItem?.effect}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">기원/출처</Label>
                <Input
                  id="origin"
                  name="origin"
                  defaultValue={editingItem?.origin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">재질</Label>
                <Input
                  id="material"
                  name="material"
                  defaultValue={editingItem?.material}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">소유자</Label>
              <Input
                id="owner"
                name="owner"
                defaultValue={editingItem?.owner}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">내력/전설</Label>
              <Textarea
                id="history"
                name="history"
                defaultValue={editingItem?.history}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
          </>
        );
      case 'groups':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingItem?.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">부제/별칭</Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={editingItem?.subtitle}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">유형</Label>
                <Input id="type" name="type" defaultValue={editingItem?.type} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale">규모</Label>
                <Input
                  id="scale"
                  name="scale"
                  defaultValue={editingItem?.scale}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">상징/문장</Label>
              <Input
                id="symbol"
                name="symbol"
                defaultValue={editingItem?.symbol}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">목적/이념</Label>
              <Input
                id="purpose"
                name="purpose"
                defaultValue={editingItem?.purpose}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">주요 활동</Label>
              <Textarea
                id="activity"
                name="activity"
                defaultValue={editingItem?.activity}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">역사</Label>
              <Textarea
                id="history"
                name="history"
                defaultValue={editingItem?.history}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">주요 구성원 (쉼표로 구분)</Label>
              <Input
                id="members"
                name="members"
                defaultValue={editingItem?.members?.join(', ')}
              />
            </div>
          </>
        );
      case 'worldviews':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">세계관 명칭</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingItem?.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">부제/별칭</Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={editingItem?.subtitle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Input
                id="category"
                name="category"
                defaultValue={editingItem?.category}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="geography">지리/환경</Label>
              <Textarea
                id="geography"
                name="geography"
                defaultValue={editingItem?.geography}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="culture">문화/사회</Label>
              <Textarea
                id="culture"
                name="culture"
                defaultValue={editingItem?.culture}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">역사</Label>
              <Textarea
                id="history"
                name="history"
                defaultValue={editingItem?.history}
                className="min-h-[60px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="law">법률/규칙</Label>
                <Input id="law" name="law" defaultValue={editingItem?.law} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="magic">마법/기술</Label>
                <Input
                  id="magic"
                  name="magic"
                  defaultValue={editingItem?.magic}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technology">기술 수준</Label>
                <Input
                  id="technology"
                  name="technology"
                  defaultValue={editingItem?.technology}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="race">종족 구성</Label>
                <Input id="race" name="race" defaultValue={editingItem?.race} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={editingItem?.tags?.join(', ')}
              />
            </div>
          </>
        );
      case 'plots':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">사건명</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingItem?.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">부제/별칭</Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={editingItem?.subtitle}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">발생 시점</Label>
                <Input
                  id="date"
                  name="date"
                  defaultValue={editingItem?.date}
                  placeholder="예: 2025년 1월 1일, 제1장 3화 등"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">발생 장소</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingItem?.location}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cause">원인/배경</Label>
              <Textarea
                id="cause"
                name="cause"
                defaultValue={editingItem?.cause}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flow">전개 과정</Label>
              <Textarea
                id="flow"
                name="flow"
                defaultValue={editingItem?.flow}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result">결과</Label>
              <Textarea
                id="result"
                name="result"
                defaultValue={editingItem?.result}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="influence">영향/여파</Label>
              <Textarea
                id="influence"
                name="influence"
                defaultValue={editingItem?.influence}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">관련 인물 (쉼표로 구분)</Label>
              <Input
                id="participants"
                name="participants"
                defaultValue={editingItem?.participants?.join(', ')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description}
                required
                className="min-h-[100px]"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full border-l border-border bg-card/50',
        className,
      )}
    >
      <div className="h-12 px-4 border-b border-border flex items-center justify-between bg-card shrink-0 whitespace-nowrap overflow-hidden">
        <h3 className="font-semibold text-sm flex items-center gap-2 shrink-0">
          <Settings className="w-4 h-4 text-purple-500" />
          설정집
        </h3>
        <div className="flex gap-1 shrink-0 ml-auto">
          <Button
            variant={isSearchOpen ? 'secondary' : 'ghost'}
            size="icon"
            className="h-6 w-6"
            title="검색"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            title="내보내기"
            onClick={handleExport}
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="p-2 border-b bg-muted/20 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder={
                searchMode === 'keyword' ? '키워드 검색...' : '유사도 검색...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e);
              }}
              className="h-8 text-xs"
            />
            <Button size="sm" className="h-8" onClick={handleSearch}>
              검색
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={searchMode === 'keyword' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => setSearchMode('keyword')}
            >
              키워드
            </Button>
            <Button
              variant={searchMode === 'semantic' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => setSearchMode('semantic')}
            >
              유사도
            </Button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-scroll overflow-x-hidden h-full">
        <div className="p-4 space-y-6 min-w-[320px]">
          {/* Work Info */}
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              {work?.title}
              <span className="text-xs font-normal text-muted-foreground">
                (
                {work?.status === 'COMPLETED'
                  ? '완결'
                  : `현재 ${manuscriptCount}화`}
                )
              </span>
            </h2>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                className={cn(
                  'h-12 flex items-center justify-center gap-1',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent',
                )}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="text-xs font-medium">{cat.label}</span>
              </Button>
            ))}
          </div>

          {/* Content List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                {categories.find((c) => c.id === activeCategory)?.label} 목록
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCreateClick}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Similarity Check Dialog */}
      <Dialog
        open={isSimilarityCheckOpen}
        onOpenChange={setIsSimilarityCheckOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>유사 설정 확인</DialogTitle>
            <DialogDescription>
              생성/수정하려는 설정과 유사한 기존 설정이 발견되었습니다. 중복
              여부를 확인해주세요.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            {checkSimilarityMutation.isPending ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : similaritySearchResults.length > 0 ? (
              <div className="space-y-4">
                {similaritySearchResults.map((result, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {result.keyword}
                        <Badge variant="outline" className="text-[10px]">
                          {result.category}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 text-xs text-muted-foreground">
                      {typeof result.setting === 'string'
                        ? JSON.parse(result.setting).description
                        : result.setting?.description || '설명 없음'}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                유사한 설정이 발견되지 않았습니다.
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <div className="flex items-center gap-2 p-2 border rounded bg-muted/20">
              <Checkbox
                id="confirm-check"
                checked={isConfirmed}
                onCheckedChange={(c) => setIsConfirmed(c === true)}
              />
              <label
                htmlFor="confirm-check"
                className="text-sm cursor-pointer select-none"
              >
                유사한 설정을 확인하였으며, 계속 진행합니다.
              </label>
            </div>
            <div className="flex gap-2 justify-end w-full">
              <Button
                variant="outline"
                onClick={() => setIsSimilarityCheckOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleConfirmSave} disabled={!isConfirmed}>
                {editingItem?.id ? '수정 완료' : '생성 완료'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? '설정 수정' : '새 설정 추가'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              {renderFormFields()}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                취소
              </Button>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LorebookCard({
  item,
  title,
  description,
  tags = [],
  onEdit,
  onDelete,
}: {
  item: any;
  title: string;
  description: string;
  tags?: string[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="relative group">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-semibold text-sm line-clamp-1">{title}</h5>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit(item)}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
