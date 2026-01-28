import { useState, useEffect, useContext, useRef } from 'react';
import { AuthorBreadcrumbContext } from './AuthorBreadcrumbContext';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../../components/ui/resizable';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import {
  Save,
  Sidebar,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelLeftClose,
  PanelRightOpen,
  PanelLeftOpen,
  BookOpen,
  Send,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Globe,
  MapPin,
  Package,
  Users2,
  Check,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorService } from '../../../services/authorService';
import { AuthorWorkExplorer } from './AuthorWorkExplorer';
import { AuthorLorebookPanel } from './AuthorLorebookPanel';
import {
  EpisodeDto,
  WorkResponseDto,
  WorkCreateRequestDto,
  WorkUpdateRequestDto,
  KeywordExtractionResponseDto,
  SettingBookDiffDto,
  PublishAnalysisResponseDto,
} from '../../../types/author';
import { cn } from '../../../components/ui/utils';
import { toast } from 'sonner';
import { Checkbox } from '../../../components/ui/checkbox';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Badge } from '../../../components/ui/badge';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';

interface AuthorWorksProps {
  integrationId: string;
}

export function AuthorWorks({ integrationId }: AuthorWorksProps) {
  const queryClient = useQueryClient();
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeDto | null>(
    null,
  );

  const { setBreadcrumbs, onNavigate } = useContext(AuthorBreadcrumbContext);

  // Panel States
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); // Default closed

  // Editor State
  const [editorContent, setEditorContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // History State for Undo/Redo
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoing = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update history with debounce
  const updateHistory = (newContent: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    }, 500);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    setIsDirty(true);

    if (!isUndoing.current) {
      updateHistory(newContent);
    }
  };

  // Modals State
  const [isCreateWorkOpen, setIsCreateWorkOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [metadataWork, setMetadataWork] = useState<WorkResponseDto | null>(
    null,
  );
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkSynopsis, setNewWorkSynopsis] = useState('');
  const [newWorkGenre, setNewWorkGenre] = useState('');
  const [newWorkCover, setNewWorkCover] = useState(''); // Optional
  const [isPublishPasswordOpen, setIsPublishPasswordOpen] = useState(false);
  const [publishPassword, setPublishPassword] = useState('');
  const [isCreateEpisodeOpen, setIsCreateEpisodeOpen] = useState(false);
  const [createEpisodeWorkId, setCreateEpisodeWorkId] = useState<number | null>(
    null,
  );
  const [newEpisodeTitle, setNewEpisodeTitle] = useState('');
  const [newEpisodeSubtitle, setNewEpisodeSubtitle] = useState('');

  const [isKeywordSelectionOpen, setIsKeywordSelectionOpen] = useState(false);

  // New States
  const [extractedKeywords, setExtractedKeywords] = useState<
    KeywordExtractionResponseDto['keywords'] | null
  >(null);
  const [selectedKeywords, setSelectedKeywords] = useState<{
    [key: string]: string[];
  }>({});
  const [isKeywordSelectionConfirmed, setIsKeywordSelectionConfirmed] =
    useState(false);
  const [processingStatus, setProcessingStatus] = useState<
    Record<number, 'EXTRACTING' | 'ANALYZING' | 'REVIEW_READY'>
  >({});
  const [analysisResults, setAnalysisResults] = useState<
    Record<number, PublishAnalysisResponseDto>
  >({});
  const [settingBookDiff, setSettingBookDiff] =
    useState<PublishAnalysisResponseDto | null>(null);

  const [isFinalReviewOpen, setIsFinalReviewOpen] = useState(false);
  const [reviewEpisode, setReviewEpisode] = useState<EpisodeDto | null>(null);
  const [reviewConfirmText, setReviewConfirmText] = useState('');
  const [isFinalReviewConfirmed, setIsFinalReviewConfirmed] = useState(false);

  const [editMetadataTitle, setEditMetadataTitle] = useState('');

  // Diff Modal Category State
  type Category =
    | 'characters'
    | 'places'
    | 'items'
    | 'groups'
    | 'worldviews'
    | 'plots';
  const [activeDiffCategory, setActiveDiffCategory] =
    useState<Category>('characters');
  const [editingItems, setEditingItems] = useState<Set<string>>(new Set());

  const toggleEditItem = (id: string) => {
    setEditingItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const categories: { id: Category; label: string; icon: React.ElementType }[] =
    [
      { id: 'characters', label: '인물', icon: Users },
      { id: 'places', label: '장소', icon: MapPin },
      { id: 'items', label: '물건', icon: Package },
      { id: 'groups', label: '집단', icon: Users2 },
      { id: 'worldviews', label: '세계', icon: Globe },
      { id: 'plots', label: '사건', icon: BookOpen },
    ];
  const [editMetadataSynopsis, setEditMetadataSynopsis] = useState('');
  const [editMetadataGenre, setEditMetadataGenre] = useState('');

  // Rename & Delete State
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renamingWork, setRenamingWork] = useState<WorkResponseDto | null>(
    null,
  );
  const [renameTitle, setRenameTitle] = useState('');

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingWorkId, setDeletingWorkId] = useState<number | null>(null);

  // Episode Rename & Delete State
  const [isRenameEpisodeOpen, setIsRenameEpisodeOpen] = useState(false);
  const [renamingEpisode, setRenamingEpisode] = useState<{
    workId: number;
    episode: EpisodeDto;
  } | null>(null);
  const [renameEpisodeTitle, setRenameEpisodeTitle] = useState('');

  const [isDeleteEpisodeAlertOpen, setIsDeleteEpisodeAlertOpen] =
    useState(false);
  const [deletingEpisode, setDeletingEpisode] = useState<{
    workId: number;
    episodeId: number;
  } | null>(null);

  // Keyword Extraction Mutation
  const keywordExtractionMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWorkId || !selectedEpisode) return;
      return authorService.publishKeywords(selectedWorkId.toString(), {
        content: editorContent,
        episodeId: selectedEpisode.id,
      });
    },
    onSuccess: (data) => {
      if (data) {
        setExtractedKeywords(data.keywords);
        setIsKeywordSelectionOpen(true);
        // Select all keywords by default
        setSelectedKeywords(data.keywords);
        setIsKeywordSelectionConfirmed(false);
      }
    },
    onError: () => {
      toast.error('키워드 추출에 실패했습니다.');
    },
  });

  // Analysis Mutation
  const analysisMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWorkId) return;
      return authorService.publishAnalysis(selectedWorkId.toString(), {
        selectedKeywords: {
          characters: selectedKeywords['characters'] || [],
          locations: selectedKeywords['locations'] || [],
          events: selectedKeywords['events'] || [],
          groups: selectedKeywords['groups'] || [],
          items: selectedKeywords['items'] || [],
          worlds: selectedKeywords['worlds'] || [],
        },
      });
    },
    onSuccess: (data) => {
      if (data) {
        setSettingBookDiff(data);
        setIsKeywordSelectionOpen(false);
        setIsFinalReviewOpen(true);
      }
    },
    onError: () => {
      toast.error('설정집 분석에 실패했습니다.');
    },
  });

  // Confirm Publish Mutation
  const confirmPublishMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWorkId) return;
      return authorService.publishConfirm(selectedWorkId.toString());
    },
    onSuccess: () => {
      toast.success('설정집이 업데이트되고 연재가 완료되었습니다.');
      setIsFinalReviewOpen(false);
      setSettingBookDiff(null);
      if (selectedEpisode) {
        setSelectedEpisode({ ...selectedEpisode, isReadOnly: true });
      }
      queryClient.invalidateQueries({
        queryKey: ['author', 'work', selectedWorkId, 'episodes'],
      });
    },
    onError: () => {
      toast.error('연재 처리에 실패했습니다.');
    },
  });

  // Fetch Works
  const { data: works } = useQuery({
    queryKey: ['author', 'works'],
    queryFn: () => authorService.getWorks(integrationId),
  });

  // Rename Work Mutation
  const renameWorkMutation = useMutation({
    mutationFn: async () => {
      if (!renamingWork) return;
      return authorService.updateWork(integrationId, {
        id: renamingWork.id,
        title: renameTitle,
        description: renamingWork.description,
        status: renamingWork.status,
        synopsis: renamingWork.synopsis,
        genre: renamingWork.genre,
      });
    },
    onSuccess: () => {
      toast.success('작품 이름이 변경되었습니다.');
      setIsRenameOpen(false);
      setRenamingWork(null);
      setRenameTitle('');
      queryClient.invalidateQueries({ queryKey: ['author', 'works'] });
    },
    onError: () => {
      toast.error('작품 이름 변경에 실패했습니다.');
    },
  });

  // Delete Work Mutation
  const deleteWorkMutation = useMutation({
    mutationFn: async () => {
      if (!deletingWorkId) return;
      return authorService.deleteWork(deletingWorkId);
    },
    onSuccess: () => {
      toast.success('작품이 삭제되었습니다.');
      setIsDeleteAlertOpen(false);
      setDeletingWorkId(null);
      queryClient.invalidateQueries({ queryKey: ['author', 'works'] });
      // If deleted work was selected, deselect it
      if (selectedWorkId === deletingWorkId) {
        setSelectedWorkId(null);
        setSelectedEpisode(null);
        setEditorContent('');
      }
    },
    onError: () => {
      toast.error('작품 삭제에 실패했습니다.');
    },
  });

  // Fetch Episode Content
  const { data: episodeDetail, isLoading: isEpisodeLoading } = useQuery({
    queryKey: ['author', 'episode', selectedWorkId, selectedEpisode?.id],
    queryFn: () =>
      selectedWorkId && selectedEpisode
        ? authorService.getEpisodeDetail(
            selectedWorkId.toString(),
            selectedEpisode.id.toString(),
          )
        : null,
    enabled: !!selectedWorkId && !!selectedEpisode,
  });

  // Sync content when episode detail loads
  useEffect(() => {
    if (episodeDetail) {
      setEditorContent(episodeDetail.content);
      setIsDirty(false);
    }
  }, [episodeDetail]);

  // Update Breadcrumbs
  useEffect(() => {
    const breadcrumbs: { label: string; onClick?: () => void }[] = [
      { label: '홈', onClick: () => onNavigate('home') },
      {
        label: '작품 관리',
        onClick: () => {
          setSelectedWorkId(null);
          setSelectedEpisode(null);
        },
      },
    ];

    if (selectedWorkId && works) {
      const work = works.find((w) => w.id === selectedWorkId);
      if (work) {
        breadcrumbs.push({
          label: work.title,
          onClick: () => {
            setSelectedEpisode(null);
          },
        });
      }
    }

    if (selectedEpisode) {
      breadcrumbs.push({
        label: selectedEpisode.title,
      });
    }

    setBreadcrumbs(breadcrumbs);
  }, [selectedWorkId, selectedEpisode, works, setBreadcrumbs, onNavigate]);

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedWorkId || !selectedEpisode) return;
      await authorService.updateEpisode(
        selectedWorkId.toString(),
        selectedEpisode.id.toString(),
        editorContent,
      );
    },
    onSuccess: () => {
      toast.success('저장되었습니다.');
      setIsDirty(false);
      queryClient.invalidateQueries({
        queryKey: ['author', 'episode', selectedWorkId, selectedEpisode?.id],
      });
    },
  });

  // Create Work Mutation
  const createWorkMutation = useMutation({
    mutationFn: async (data: WorkCreateRequestDto) => {
      await authorService.createWork(data);
    },
    onSuccess: () => {
      toast.success('작품이 생성되었습니다.');
      setIsCreateWorkOpen(false);
      setNewWorkTitle('');
      queryClient.invalidateQueries({ queryKey: ['author', 'works'] });
    },
  });

  // Create Episode Mutation
  const createEpisodeMutation = useMutation({
    mutationFn: async ({
      workId,
      title,
      subtitle,
    }: {
      workId: string;
      title: string;
      subtitle?: string;
    }) => {
      await authorService.createEpisode(workId, title, subtitle);
    },
    onSuccess: (_, variables) => {
      toast.success('원문이 생성되었습니다.');
      setIsCreateEpisodeOpen(false);
      setNewEpisodeTitle('');
      setNewEpisodeSubtitle('');
      queryClient.invalidateQueries({
        queryKey: ['author', 'work', Number(variables.workId), 'episodes'],
      });
    },
  });

  const renameEpisodeMutation = useMutation({
    mutationFn: async () => {
      if (!renamingEpisode) return;
      await authorService.updateEpisodeTitle(
        renamingEpisode.workId.toString(),
        renamingEpisode.episode.id.toString(),
        renameEpisodeTitle,
      );
    },
    onSuccess: () => {
      toast.success('원문 이름이 변경되었습니다.');
      setIsRenameEpisodeOpen(false);
      setRenamingEpisode(null);
      setRenameEpisodeTitle('');
      if (renamingEpisode) {
        queryClient.invalidateQueries({
          queryKey: ['author', 'work', renamingEpisode.workId, 'episodes'],
        });
      }
    },
    onError: () => {
      toast.error('원문 이름 변경에 실패했습니다.');
    },
  });

  const deleteEpisodeMutation = useMutation({
    mutationFn: async () => {
      if (!deletingEpisode) return;
      await authorService.deleteEpisode(
        deletingEpisode.workId.toString(),
        deletingEpisode.episodeId.toString(),
      );
    },
    onSuccess: () => {
      toast.success('원문이 삭제되었습니다.');
      setIsDeleteEpisodeAlertOpen(false);

      if (
        selectedEpisode &&
        deletingEpisode &&
        selectedEpisode.id === deletingEpisode.episodeId
      ) {
        setSelectedEpisode(null);
        setEditorContent('');
      }

      if (deletingEpisode) {
        queryClient.invalidateQueries({
          queryKey: ['author', 'work', deletingEpisode.workId, 'episodes'],
        });
      }
      setDeletingEpisode(null);
    },
    onError: () => {
      toast.error('원문 삭제에 실패했습니다.');
    },
  });

  // Ctrl+S Handler
  useEffect(() => {
    const handleGlobalSaveShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (selectedEpisode && isDirty && !saveMutation.isPending) {
          if (selectedEpisode.isReadOnly) {
            toast.error('읽기 전용 에피소드는 저장할 수 없습니다.');
            return;
          }
          saveMutation.mutate();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalSaveShortcut);
    return () =>
      window.removeEventListener('keydown', handleGlobalSaveShortcut);
  }, [selectedEpisode, isDirty, saveMutation]);

  const handleSelectWork = (workId: number) => {
    setSelectedWorkId(workId);
    if (selectedWorkId !== workId) {
      setSelectedEpisode(null);
      setEditorContent('');
    }
  };

  const handleSelectEpisode = (workId: number, episode: EpisodeDto) => {
    if (isDirty) {
      if (!confirm('작성 중인 내용이 저장되지 않았습니다. 이동하시겠습니까?')) {
        return;
      }
    }
    setSelectedWorkId(workId);
    setSelectedEpisode(episode);
    // Removed auto-open right sidebar
  };

  const handleOpenMetadata = (work: WorkResponseDto) => {
    setMetadataWork(work);
    setIsMetadataOpen(true);
  };

  const handleOpenLorebook = (work: WorkResponseDto) => {
    setSelectedWorkId(work.id);
    setIsRightSidebarOpen(true);
  };

  const handleRenameWork = (work: WorkResponseDto) => {
    setRenamingWork(work);
    setRenameTitle(work.title);
    setIsRenameOpen(true);
  };

  const handleDeleteWork = (workId: number) => {
    setDeletingWorkId(workId);
    setIsDeleteAlertOpen(true);
  };

  const handleRenameEpisode = (workId: number, episode: EpisodeDto) => {
    setRenamingEpisode({ workId, episode });
    setRenameEpisodeTitle(episode.title);
    setIsRenameEpisodeOpen(true);
  };

  const handleDeleteEpisode = (workId: number, episodeId: number) => {
    setDeletingEpisode({ workId, episodeId });
    setIsDeleteEpisodeAlertOpen(true);
  };

  const handleCreateWork = () => {
    if (!newWorkTitle.trim()) {
      toast.error('작품 제목을 입력해주세요.');
      return;
    }
    createWorkMutation.mutate({
      title: newWorkTitle,
      synopsis: newWorkSynopsis,
      genre: newWorkGenre,
      coverImageUrl: newWorkCover,
      description: '',
      integrationId,
    });
  };

  const handleCreateEpisode = (workId: number) => {
    setCreateEpisodeWorkId(workId);
    setNewEpisodeTitle('');
    setNewEpisodeSubtitle('');
    setIsCreateEpisodeOpen(true);
  };

  const handleSubmitCreateEpisode = () => {
    if (!createEpisodeWorkId) return;
    if (!newEpisodeTitle.trim()) {
      toast.error('원문 제목을 입력해주세요.');
      return;
    }

    createEpisodeMutation.mutate({
      workId: createEpisodeWorkId.toString(),
      title: newEpisodeTitle.trim(),
      subtitle: newEpisodeSubtitle.trim(),
    });
  };

  const handlePublishClick = () => {
    if (!selectedEpisode) return;
    if (isDirty) {
      toast.error('먼저 저장해주세요.');
      return;
    }

    const status = processingStatus[selectedEpisode.id];

    if (status === 'ANALYZING') {
      toast.info('설정집 분석이 진행 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (status === 'REVIEW_READY') {
      const result = analysisResults[selectedEpisode.id];
      if (result) {
        setSettingBookDiff(result);
        setIsFinalReviewOpen(true);
        setIsFinalReviewConfirmed(false);
      } else {
        toast.error('분석 결과를 찾을 수 없습니다. 다시 시도해주세요.');
        // Maybe reset status?
      }
      return;
    }

    if (confirm('연재하시겠습니까?')) {
      setIsPublishPasswordOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    // Mock password check
    if (publishPassword === '1234') {
      setIsPublishPasswordOpen(false);
      setPublishPassword('');

      if (selectedEpisode) {
        setProcessingStatus((prev) => ({
          ...prev,
          [selectedEpisode.id]: 'EXTRACTING',
        }));
      }

      toast.info('AI가 원문을 분석하여 키워드를 추출하고 있습니다...');
      keywordExtractionMutation.mutate();
    } else {
      toast.error('비밀번호가 일치하지 않습니다. (테스트: 1234)');
    }
  };

  const handleOpenReview = (workId: number, episode: EpisodeDto) => {
    if (episode.isReadOnly) return; // Already published

    // If it's in REVIEW_READY state, open it
    const status = processingStatus[episode.id];
    if (status === 'REVIEW_READY') {
      const result = analysisResults[episode.id];
      if (result) {
        setSettingBookDiff(result);
        setIsFinalReviewOpen(true);
        return;
      }
    }

    // Otherwise show standard message
    toast.info('진행 중인 연재 프로세스가 없습니다.');
  };

  const handleKeywordToggle = (category: string, keyword: string) => {
    setSelectedKeywords((prev) => {
      const currentList = prev[category] || [];
      const newList = currentList.includes(keyword)
        ? currentList.filter((k) => k !== keyword)
        : [...currentList, keyword];
      return { ...prev, [category]: newList };
    });
  };

  const handleSelectAllKeywords = (selectAll: boolean) => {
    if (!extractedKeywords) return;
    if (selectAll) {
      setSelectedKeywords(extractedKeywords);
    } else {
      setSelectedKeywords({});
    }
  };

  const handleCategoryToggle = (category: string, all: boolean) => {
    if (!extractedKeywords) return;
    const categoryKeywords = (extractedKeywords as any)[category] || [];
    setSelectedKeywords((prev) => ({
      ...prev,
      [category]: all ? categoryKeywords : [],
    }));
  };

  const handleKeywordSubmit = () => {
    if (!isKeywordSelectionConfirmed) {
      toast.error('확인 체크박스에 체크해주세요.');
      return;
    }

    if (selectedEpisode) {
      setProcessingStatus((prev) => ({
        ...prev,
        [selectedEpisode.id]: 'ANALYZING',
      }));
    }

    setIsKeywordSelectionOpen(false);
    toast.info(
      '설정집 변경사항을 분석 중입니다... (시간이 소요될 수 있습니다)',
    );
    analysisMutation.mutate();
  };

  // Helper to handle diff changes in final review
  const handleDiffChange = (
    id: string,
    field: keyof SettingBookDiffDto,
    value: any,
  ) => {
    if (!settingBookDiff) return;
    setSettingBookDiff({
      ...settingBookDiff,
      after: settingBookDiff.after.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const handleDiffDelete = (id: string) => {
    if (!settingBookDiff) return;
    setSettingBookDiff({
      ...settingBookDiff,
      after: settingBookDiff.after.filter((item) => item.id !== id),
    });
  };

  // Update Work Mutation
  const updateWorkMutation = useMutation({
    mutationFn: async (data: WorkUpdateRequestDto) => {
      if (!metadataWork) return;
      await authorService.updateWork(metadataWork.id.toString(), data);
    },
    onSuccess: () => {
      toast.success('작품 정보가 수정되었습니다.');
      setIsMetadataOpen(false);
      queryClient.invalidateQueries({ queryKey: ['author', 'works'] });
    },
  });

  const handleUpdateMetadata = () => {
    if (!metadataWork) return;
    updateWorkMutation.mutate({
      title: editMetadataTitle,
      synopsis: editMetadataSynopsis,
      genre: editMetadataGenre,
      id: 0,
      description: '',
      status: 'ONGOING',
    });
  };

  return (
    <div className="h-[calc(100vh-6rem)] -m-4 bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Sidebar: Work Explorer */}
        {isLeftSidebarOpen && (
          <>
            <ResizablePanel defaultSize={20} minSize={15}>
              <AuthorWorkExplorer
                works={works || []}
                selectedWorkId={selectedWorkId}
                selectedEpisodeId={selectedEpisode?.id || null}
                processingStatus={processingStatus}
                onSelectWork={handleSelectWork}
                onSelectEpisode={handleSelectEpisode}
                onOpenMetadata={handleOpenMetadata}
                onOpenLorebook={handleOpenLorebook}
                onCreateWork={() => setIsCreateWorkOpen(true)}
                onCreateEpisode={handleCreateEpisode}
                onReviewRequired={handleOpenReview}
                onRenameWork={handleRenameWork}
                onDeleteWork={handleDeleteWork}
                onRenameEpisode={handleRenameEpisode}
                onDeleteEpisode={handleDeleteEpisode}
                className="h-full"
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        {/* Center: Editor */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="flex flex-col h-full overflow-hidden">
            {/* Editor Toolbar */}
            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                  title={
                    isLeftSidebarOpen ? '사이드바 접기' : '사이드바 펼치기'
                  }
                >
                  {isLeftSidebarOpen ? (
                    <ChevronsLeft className="w-4 h-4" />
                  ) : (
                    <ChevronsRight className="w-4 h-4" />
                  )}
                </Button>

                {selectedEpisode ? (
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {works?.find((w) => w.id === selectedWorkId)?.title}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span>{selectedEpisode.title}</span>
                    {selectedEpisode.isReadOnly && (
                      <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                        읽기 전용
                      </span>
                    )}
                    {isDirty && (
                      <span className="text-xs text-orange-500 font-normal">
                        (수정됨)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    작품과 회차를 선택해주세요
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Save & Publish Buttons */}
                {selectedEpisode && !selectedEpisode.isReadOnly && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveMutation.mutate()}
                      disabled={!isDirty || saveMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    {processingStatus[selectedEpisode.id] === 'ANALYZING' ? (
                      <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500 border-blue-200"
                      >
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI 분석 중
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handlePublishClick}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        연재
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  disabled={!selectedWorkId} // Enable if work is selected
                  title={isRightSidebarOpen ? '설정집 접기' : '설정집 펼치기'}
                >
                  {isRightSidebarOpen ? (
                    <ChevronsRight className="w-4 h-4" />
                  ) : (
                    <ChevronsLeft className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 relative bg-background overflow-y-auto">
              {selectedEpisode ? (
                isEpisodeLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    데이터를 불러오는 중입니다...
                  </div>
                ) : (
                  <Textarea
                    value={editorContent}
                    onChange={handleEditorChange}
                    readOnly={selectedEpisode.isReadOnly}
                    className={cn(
                      'w-full h-full resize-none border-none focus-visible:ring-0 p-8 text-lg leading-relaxed font-serif overflow-y-auto',
                      selectedEpisode.isReadOnly &&
                        'bg-secondary/10 cursor-default',
                    )}
                    placeholder="여기에 내용을 작성하세요..."
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                  <BookOpen className="w-12 h-12 opacity-20" />
                  <p>왼쪽 목록에서 작품과 회차를 선택하여 집필을 시작하세요.</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        {/* Right Sidebar: Lorebook */}
        {isRightSidebarOpen && selectedWorkId && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20}>
              <AuthorLorebookPanel workId={selectedWorkId} className="h-full" />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {/* Create Work Modal */}
      <Dialog open={isCreateWorkOpen} onOpenChange={setIsCreateWorkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 작품 생성</DialogTitle>
            <DialogDescription>
              새로운 작품의 제목을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                작품 제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newWorkTitle}
                onChange={(e) => setNewWorkTitle(e.target.value)}
                placeholder="나의 멋진 소설"
              />
            </div>
            <div className="space-y-2">
              <Label>시놉시스 (선택)</Label>
              <Textarea
                value={newWorkSynopsis}
                onChange={(e) => setNewWorkSynopsis(e.target.value)}
                placeholder="작품의 줄거리를 입력하세요"
                className="h-24 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>장르 (선택)</Label>
              <Input
                value={newWorkGenre}
                onChange={(e) => setNewWorkGenre(e.target.value)}
                placeholder="예: 판타지, 로맨스"
              />
            </div>
            <div className="space-y-2">
              <Label>표지 이미지 URL (선택)</Label>
              <Input
                value={newWorkCover}
                onChange={(e) => setNewWorkCover(e.target.value)}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateWorkOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateWork}
              disabled={createWorkMutation.isPending}
            >
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Episode Modal */}
      <Dialog open={isCreateEpisodeOpen} onOpenChange={setIsCreateEpisodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 원문(회차) 생성</DialogTitle>
            <DialogDescription>
              새로운 회차의 제목과 부제를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                회차 제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newEpisodeTitle}
                onChange={(e) => setNewEpisodeTitle(e.target.value)}
                placeholder="예: 1화. 새로운 시작"
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSubmitCreateEpisode()
                }
              />
            </div>
            <div className="space-y-2">
              <Label>부제 (선택)</Label>
              <Input
                value={newEpisodeSubtitle}
                onChange={(e) => setNewEpisodeSubtitle(e.target.value)}
                placeholder="부제를 입력하세요"
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSubmitCreateEpisode()
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateEpisodeOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmitCreateEpisode}
              disabled={createEpisodeMutation.isPending}
            >
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Password Modal */}
      <Dialog
        open={isPublishPasswordOpen}
        onOpenChange={setIsPublishPasswordOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>연재를 위한 보안 확인</DialogTitle>
            <DialogDescription>
              연재를 진행하려면 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="비밀번호 입력"
              value={publishPassword}
              onChange={(e) => setPublishPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPublishPasswordOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handlePasswordSubmit}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keyword Selection Modal */}
      <Dialog
        open={isKeywordSelectionOpen}
        onOpenChange={setIsKeywordSelectionOpen}
      >
        <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>설정집 생성을 위한 키워드 선택</span>
              <div className="flex items-center gap-2 mr-8">
                <Checkbox
                  id="select-all-keywords"
                  checked={
                    !!extractedKeywords &&
                    Object.keys(extractedKeywords).every(
                      (category) =>
                        (selectedKeywords[category] || []).length ===
                        (extractedKeywords as any)[category].length,
                    )
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAllKeywords(checked === true)
                  }
                />
                <label
                  htmlFor="select-all-keywords"
                  className="text-sm font-normal cursor-pointer"
                >
                  전체 선택
                </label>
              </div>
            </DialogTitle>
            <DialogDescription>
              AI가 추출한 키워드 중 설정집에 반영할 항목을 선택해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 gap-6 py-4">
              {extractedKeywords ? (
                Object.entries(extractedKeywords).map(
                  ([category, keywords]) => {
                    const categoryLabel: { [key: string]: string } = {
                      characters: '인물 (Characters)',
                      locations: '장소 (Locations)',
                      events: '사건 (Events)',
                      groups: '집단 (Groups)',
                      items: '물건 (Items)',
                      worlds: '세계 (Worlds)',
                    };
                    const isAllSelected =
                      keywords.length > 0 &&
                      (selectedKeywords[category] || []).length ===
                        keywords.length;

                    return (
                      <div
                        key={category}
                        className="space-y-3 border rounded-lg p-4 bg-muted/20"
                      >
                        <h4 className="font-semibold flex items-center gap-2">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={(checked) =>
                              handleCategoryToggle(category, checked === true)
                            }
                          />
                          {categoryLabel[category] || category}
                          <Badge variant="secondary" className="ml-auto">
                            {keywords.length}
                          </Badge>
                        </h4>
                        <div className="space-y-2">
                          {keywords.length > 0 ? (
                            keywords.map((keyword) => (
                              <div
                                key={keyword}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`kw-${category}-${keyword}`}
                                  checked={(
                                    selectedKeywords[category] || []
                                  ).includes(keyword)}
                                  onCheckedChange={() =>
                                    handleKeywordToggle(category, keyword)
                                  }
                                />
                                <label
                                  htmlFor={`kw-${category}-${keyword}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {keyword}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              추출된 키워드가 없습니다.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>AI가 원문을 분석하고 있습니다...</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-4 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="confirm-publish"
                  checked={isKeywordSelectionConfirmed}
                  onCheckedChange={(checked) =>
                    setIsKeywordSelectionConfirmed(checked === true)
                  }
                />
                <label
                  htmlFor="confirm-publish"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  위 내용으로 설정집 분석을 진행합니다.
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsKeywordSelectionOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={handleKeywordSubmit}
                  disabled={
                    !isKeywordSelectionConfirmed || analysisMutation.isPending
                  }
                >
                  {analysisMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    '분석 시작'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Metadata Modal */}
      <Dialog open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>작품 메타데이터 수정</DialogTitle>
          </DialogHeader>
          {metadataWork && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={editMetadataTitle}
                  onChange={(e) => setEditMetadataTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>시놉시스</Label>
                <Textarea
                  value={editMetadataSynopsis}
                  onChange={(e) => setEditMetadataSynopsis(e.target.value)}
                  placeholder="시놉시스를 입력하세요."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>장르</Label>
                <Input
                  value={editMetadataGenre}
                  onChange={(e) => setEditMetadataGenre(e.target.value)}
                  placeholder="장르를 입력하세요 (예: 판타지, 로맨스)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMetadataOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleUpdateMetadata}
              disabled={updateWorkMutation.isPending}
            >
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Review Modal */}
      <Dialog open={isFinalReviewOpen} onOpenChange={setIsFinalReviewOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0 rounded-xl border shadow-2xl">
          <DialogHeader className="p-6 pb-4 shrink-0 border-b bg-background z-10">
            <DialogTitle>설정집 변경 사항 확인 (최종 검수)</DialogTitle>
            <DialogDescription>
              AI가 생성한 설정집 변경 사항을 확인하세요. 카테고리별로 상세
              내용을 검토하고 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {/* Category Tabs */}
          <div className="px-6 py-4 shrink-0 bg-background border-b z-10">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg overflow-x-auto w-max">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeDiffCategory === cat.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveDiffCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-2 px-4',
                    activeDiffCategory === cat.id && 'shadow-sm',
                  )}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Unified Scroll Container (Grid Layout) */}
          <div className="flex-1 overflow-y-auto p-8 scroll-auto bg-muted/5">
            <div className="max-w-[1800px] mx-auto space-y-8">
              {/* Column Headers */}
              <div className="grid grid-cols-2 gap-12 mb-6 px-1">
                <h4 className="font-bold text-lg flex items-center gap-3 text-muted-foreground">
                  <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  이전 설정집
                </h4>
                <h4 className="font-bold text-lg flex items-center gap-3 text-foreground">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  업데이트된 설정집
                </h4>
              </div>

              {/* Rows */}
              {settingBookDiff?.after
                .filter((item) => item.category === activeDiffCategory)
                .map((afterItem) => {
                  const beforeItem = settingBookDiff.before.find(
                    (b) => b.id === afterItem.id,
                  );
                  return (
                    <div
                      key={afterItem.id}
                      className="grid grid-cols-2 gap-12 items-stretch group"
                    >
                      {/* Left: Before (Read-only) */}
                      <div>
                        {beforeItem ? (
                          <div className="border bg-card/50 rounded-xl p-6 h-full opacity-60 hover:opacity-100 transition-opacity">
                            <div className="flex items-start justify-between mb-4">
                              <h5 className="font-bold text-lg text-muted-foreground">
                                {beforeItem.name || beforeItem.title}
                              </h5>
                            </div>

                            {/* Specific Fields Display (Read-only) */}
                            {beforeItem.category === 'characters' && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {beforeItem.role && (
                                  <Badge variant="secondary" className="px-2">
                                    {beforeItem.role}
                                  </Badge>
                                )}
                                {beforeItem.age && (
                                  <Badge variant="outline" className="px-2">
                                    {beforeItem.age}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {beforeItem.category === 'places' &&
                              beforeItem.location && (
                                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {beforeItem.location}
                                </div>
                              )}
                            {beforeItem.category === 'items' &&
                              beforeItem.type && (
                                <div className="mb-4">
                                  <Badge variant="outline">
                                    {beforeItem.type}
                                  </Badge>
                                </div>
                              )}
                            {beforeItem.category === 'groups' &&
                              beforeItem.members &&
                              beforeItem.members.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-1">
                                  {beforeItem.members.map((m, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {m}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
                              {beforeItem.description}
                            </p>
                          </div>
                        ) : (
                          <div className="h-full border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 min-h-[200px]">
                            <Plus className="w-8 h-8 mb-2 opacity-20" />
                            <span className="text-sm font-medium opacity-50">
                              신규 추가 항목
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: After (Editable) */}
                      <div>
                        <div
                          className={cn(
                            'border rounded-xl p-6 h-full relative group transition-all bg-card shadow-sm hover:shadow-md',
                            afterItem.status === 'NEW' &&
                              'border-green-500/50 bg-green-500/5',
                            afterItem.status === 'MODIFIED' &&
                              'border-orange-500/50 bg-orange-500/5',
                            afterItem.status === 'DELETED' &&
                              'border-red-500/50 bg-red-500/5 opacity-70',
                          )}
                        >
                          {/* Badge at Top-Left */}
                          <div className="absolute top-4 left-4 flex gap-2 z-10">
                            {afterItem.status !== 'UNCHANGED' && (
                              <Badge
                                variant={
                                  afterItem.status === 'NEW'
                                    ? 'default'
                                    : afterItem.status === 'MODIFIED'
                                      ? 'secondary'
                                      : 'destructive'
                                }
                                className={cn(
                                  'text-[10px] px-2 py-0.5 font-bold shadow-none',
                                  afterItem.status === 'NEW' && 'bg-green-600',
                                  afterItem.status === 'MODIFIED' &&
                                    'bg-orange-500 text-white',
                                )}
                              >
                                {afterItem.status}
                              </Badge>
                            )}
                          </div>

                          {/* Buttons at Top-Right */}
                          <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => toggleEditItem(afterItem.id)}
                            >
                              {editingItems.has(afterItem.id) ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDiffDelete(afterItem.id)}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>

                          <div className="space-y-4 pt-4 mt-2">
                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                                {afterItem.category === 'worldviews' ||
                                afterItem.category === 'plots'
                                  ? '제목'
                                  : '이름'}
                              </Label>
                              <Input
                                value={afterItem.name}
                                readOnly={!editingItems.has(afterItem.id)}
                                onChange={(e) =>
                                  handleDiffChange(
                                    afterItem.id,
                                    'name',
                                    e.target.value,
                                  )
                                }
                                className={cn(
                                  'font-bold text-lg px-2 -mx-2 h-auto py-1 transition-colors',
                                  editingItems.has(afterItem.id)
                                    ? 'bg-background border-input'
                                    : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                )}
                              />
                            </div>

                            {/* Specific Fields Inputs */}
                            {afterItem.category === 'characters' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                                    역할
                                  </Label>
                                  <Input
                                    value={afterItem.role || ''}
                                    readOnly={!editingItems.has(afterItem.id)}
                                    onChange={(e) =>
                                      handleDiffChange(
                                        afterItem.id,
                                        'role',
                                        e.target.value,
                                      )
                                    }
                                    className={cn(
                                      'px-2 -mx-2 transition-colors',
                                      editingItems.has(afterItem.id)
                                        ? 'bg-background border-input'
                                        : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                    )}
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                                    나이
                                  </Label>
                                  <Input
                                    value={afterItem.age || ''}
                                    readOnly={!editingItems.has(afterItem.id)}
                                    onChange={(e) =>
                                      handleDiffChange(
                                        afterItem.id,
                                        'age',
                                        e.target.value,
                                      )
                                    }
                                    className={cn(
                                      'px-2 -mx-2 transition-colors',
                                      editingItems.has(afterItem.id)
                                        ? 'bg-background border-input'
                                        : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                            {afterItem.category === 'places' && (
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  위치
                                </Label>
                                <Input
                                  value={afterItem.location || ''}
                                  readOnly={!editingItems.has(afterItem.id)}
                                  onChange={(e) =>
                                    handleDiffChange(
                                      afterItem.id,
                                      'location',
                                      e.target.value,
                                    )
                                  }
                                  className={cn(
                                    'px-2 -mx-2 transition-colors',
                                    editingItems.has(afterItem.id)
                                      ? 'bg-background border-input'
                                      : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                  )}
                                />
                              </div>
                            )}
                            {afterItem.category === 'items' && (
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  종류
                                </Label>
                                <Input
                                  value={afterItem.type || ''}
                                  readOnly={!editingItems.has(afterItem.id)}
                                  onChange={(e) =>
                                    handleDiffChange(
                                      afterItem.id,
                                      'type',
                                      e.target.value,
                                    )
                                  }
                                  className={cn(
                                    'px-2 -mx-2 transition-colors',
                                    editingItems.has(afterItem.id)
                                      ? 'bg-background border-input'
                                      : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                  )}
                                />
                              </div>
                            )}
                            {afterItem.category === 'groups' && (
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1.5 block">
                                  구성원 (쉼표로 구분)
                                </Label>
                                <Input
                                  value={afterItem.members?.join(', ') || ''}
                                  readOnly={!editingItems.has(afterItem.id)}
                                  onChange={(e) =>
                                    handleDiffChange(
                                      afterItem.id,
                                      'members',
                                      e.target.value
                                        .split(',')
                                        .map((s) => s.trim()),
                                    )
                                  }
                                  className={cn(
                                    'px-2 -mx-2 transition-colors',
                                    editingItems.has(afterItem.id)
                                      ? 'bg-background border-input'
                                      : 'bg-transparent border-transparent hover:border-transparent cursor-default',
                                  )}
                                />
                              </div>
                            )}

                            <div>
                              <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                                설명
                              </Label>
                              <Textarea
                                value={afterItem.description}
                                readOnly={!editingItems.has(afterItem.id)}
                                onChange={(e) =>
                                  handleDiffChange(
                                    afterItem.id,
                                    'description',
                                    e.target.value,
                                  )
                                }
                                className={cn(
                                  'min-h-[120px] resize-none leading-relaxed px-2 -mx-2 transition-colors',
                                  editingItems.has(afterItem.id)
                                    ? 'bg-background border-input'
                                    : 'bg-transparent border-transparent hover:border-transparent cursor-default resize-none focus-visible:ring-0',
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Empty State */}
              {!settingBookDiff?.after.filter(
                (item) => item.category === activeDiffCategory,
              ).length && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                  <BookOpen className="w-16 h-16 mb-4 stroke-1" />
                  <p className="text-lg">변경 사항이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-4 border-t pt-4 px-6 pb-6 bg-background z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="confirm-final-review"
                  checked={isFinalReviewConfirmed}
                  onCheckedChange={(checked) =>
                    setIsFinalReviewConfirmed(checked === true)
                  }
                />
                <label
                  htmlFor="confirm-final-review"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  <span className="text-yellow-600 font-bold mr-1">주의:</span>
                  변경 사항을 확인하였으며, 설정집 업데이트 및 연재 진행에
                  동의합니다.
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFinalReviewOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={() => confirmPublishMutation.mutate()}
                  disabled={
                    confirmPublishMutation.isPending || !isFinalReviewConfirmed
                  }
                >
                  {confirmPublishMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    '생성'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Work Modal */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>작품 이름 변경</DialogTitle>
            <DialogDescription>
              변경할 작품의 새로운 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              placeholder="작품 이름"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  renameWorkMutation.mutate();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => renameWorkMutation.mutate()}
              disabled={renameWorkMutation.isPending || !renameTitle.trim()}
            >
              {renameWorkMutation.isPending ? '변경 중...' : '변경'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Work Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>작품을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 작품과 관련된 모든 데이터(회차,
              설정집 등)가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteWorkMutation.mutate()}
              disabled={deleteWorkMutation.isPending}
            >
              {deleteWorkMutation.isPending ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Episode Modal */}
      <Dialog open={isRenameEpisodeOpen} onOpenChange={setIsRenameEpisodeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>원문 이름 변경</DialogTitle>
            <DialogDescription>
              변경할 원문의 새로운 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameEpisodeTitle}
              onChange={(e) => setRenameEpisodeTitle(e.target.value)}
              placeholder="원문 이름"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  renameEpisodeMutation.mutate();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameEpisodeOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => renameEpisodeMutation.mutate()}
              disabled={
                renameEpisodeMutation.isPending || !renameEpisodeTitle.trim()
              }
            >
              {renameEpisodeMutation.isPending ? '변경 중...' : '변경'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Episode Alert Dialog */}
      <AlertDialog
        open={isDeleteEpisodeAlertOpen}
        onOpenChange={setIsDeleteEpisodeAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>원문을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 원문이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteEpisodeMutation.mutate()}
              disabled={deleteEpisodeMutation.isPending}
            >
              {deleteEpisodeMutation.isPending ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
