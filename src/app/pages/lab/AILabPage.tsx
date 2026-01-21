import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Loader2,
  Play,
  RefreshCw,
  Terminal,
  MessageSquare,
  Maximize2,
  X,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';

/**
 * AI Lab Page (Ver 2.0 - 아지트 에디션)
 *
 * 🏠 여기가 우리의 아지트야!
 * AI 기능을 맘껏 테스트하고, 모달이나 각종 UI 컴포넌트들을 실험해보는 공간이지.
 *
 * [새로 추가된 것들]
 * 1. ✨ 모달(Dialog) 놀이터: 팝업창 띄우는 법을 마스터해보자!
 * 2. 🤖 AI 페르소나 테스트: AI 말투를 바꿔보는 실험
 */
export default function AILabPage() {
  // 1. 상태 관리 (State Management)
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [jsonData, setJsonData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 타자기 효과를 위한 Ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 2. AI 응답 시뮬레이션 (Streaming Effect)
  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsStreaming(true);
    setResult('');
    setJsonData(null);

    // AI 페르소나에 따른 응답 변화 (재미 요소!)
    const dummyResponse = `[AI 친구]: 안녕! 네가 입력한 "${prompt}"에 대해 생각해봤어.\n\n이건 정말 흥미로운 주제인걸? 내가 분석한 내용을 알려줄게.\n\n1. ✨ 핵심은 바로 이것!\n2. 💡 이런 아이디어는 어때?\n3. 🚀 당장 시도해보자!\n\n(이 응답은 실제 AI가 아니라, 우리가 만든 시뮬레이션이야. 멋지지?)`;

    const dummyJson = {
      status: 'success',
      model: 'friend-bot-v1',
      tokens: {
        prompt: prompt.length,
        completion: dummyResponse.length,
      },
      metadata: {
        vibe: 'friendly',
        timestamp: new Date().toISOString(),
      },
    };

    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < dummyResponse.length) {
        setResult((prev) => prev + dummyResponse[currentIndex]);
        currentIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsStreaming(false);
        setJsonData(dummyJson);
      }
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in duration-500">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center border-b pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              AI Creative Lab
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            우리의 상상력이 실현되는 비밀 아지트 ⛺
          </p>
        </div>

        {/* 모달(Dialog) 실험실 */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 border-dashed border-2">
              <Maximize2 className="h-4 w-4" />
              모달 띄워보기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>🎉 짠! 이게 바로 모달이야</DialogTitle>
              <DialogDescription>
                사용자의 주의를 집중시키고 싶을 때 사용하는 팝업창이지. 배경이
                어두워지면서(Overlay) 이 창만 돋보이게 돼.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-sm">
                "로그인이 필요합니다" 또는 "정말 삭제하시겠습니까?" 같은 중요한
                메시지를 띄울 때 딱이야!
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setModalOpen(false)}>
                확인했어! (닫기)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* 왼쪽: 컨트롤 패널 (4칸 차지) */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Prompt Station
              </CardTitle>
              <CardDescription>AI 친구에게 말을 걸어보자</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="오늘 기분은 어때? AI에게 하고 싶은 말을 적어봐..."
                className="min-h-[200px] resize-none focus-visible:ring-purple-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                onClick={handleGenerate}
                disabled={isStreaming || !prompt.trim()}
                size="lg"
              >
                {isStreaming ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    열심히 생각하는 중... 🧠
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    실행 (Run)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 개발자 노트 (팁) */}
          <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center text-yellow-700 dark:text-yellow-500">
                <Terminal className="mr-2 h-4 w-4" />
                멘토의 쪽지 📝
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                <span className="font-bold text-foreground">💡 꿀팁:</span>{' '}
                모달(Dialog)은
                <code>shadcn/ui</code>에서 가져온 컴포넌트야.
                <code>open</code> 상태를 <code>useState</code>로 관리해서 열고
                닫을 수 있어.
              </p>
              <p>
                <span className="font-bold text-foreground">🎨 스타일:</span>
                <code>bg-gradient-to-r</code> 클래스로 버튼에 그라데이션을 주면
                훨씬 고급스러워 보여!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 결과 화면 (8칸 차지) */}
        <div className="md:col-span-8 space-y-6">
          <Tabs defaultValue="preview" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950"
                >
                  📱 미리보기 (Preview)
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950"
                >
                  ⚙️ 데이터 (JSON)
                </TabsTrigger>
              </TabsList>

              {/* 상태 뱃지 */}
              {isStreaming ? (
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500 animate-pulse gap-1"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Streaming...
                </Badge>
              ) : result ? (
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  완료됨 ✨
                </Badge>
              ) : (
                <Badge variant="secondary">대기 중</Badge>
              )}
            </div>

            <TabsContent value="preview" className="mt-0">
              <Card className="min-h-[500px] flex flex-col shadow-sm border-slate-200 dark:border-slate-800">
                <CardContent className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-950/50 rounded-lg font-mono text-sm leading-7 overflow-auto whitespace-pre-wrap">
                  {result ? (
                    <div className="animate-in fade-in duration-300">
                      {result}
                      {isStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse align-middle" />
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
                      <Sparkles className="h-12 w-12 text-slate-300" />
                      <p>AI 친구가 여기서 답변을 기다리고 있어...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="json" className="mt-0">
              <Card className="min-h-[500px] border-slate-200 dark:border-slate-800">
                <CardContent className="p-0">
                  <pre className="h-[500px] p-6 bg-[#1e1e1e] text-[#d4d4d4] rounded-lg overflow-auto text-xs font-mono leading-relaxed">
                    {jsonData
                      ? JSON.stringify(jsonData, null, 2)
                      : '// 데이터가 도착하면 여기에 표시돼.\n// 백엔드 개발자와 소통할 때 이 화면을 보여주면 좋아!'}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
