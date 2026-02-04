import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Play,
  RotateCcw,
  Save,
  Book,
  Code2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Trash2,
} from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { toast } from 'sonner';
import { Mermaid } from '../../../components/Mermaid';

// API Method Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Template Interface
interface ApiTemplate {
  id: string;
  name: string;
  description: string;
  method: HttpMethod;
  endpoint: string;
  headers: string;
  body: string;
}

// Default Templates based on project_apis.csv
const API_TEMPLATES: ApiTemplate[] = [
  {
    id: 'ai_generate',
    name: '🤖 AI Chat / Generate',
    description: '기본적인 AI 텍스트 생성 요청입니다.',
    method: 'POST',
    endpoint: '/api/v1/ai/generate',
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "prompt": "판타지 소설의 첫 문장을 써줘",\n  "temperature": 0.7,\n  "max_tokens": 500\n}',
  },
  {
    id: 'analyze_work',
    name: '📊 작품 AI 분석',
    description: '특정 작품에 대한 AI 분석을 요청합니다.',
    method: 'POST',
    endpoint: '/api/v1/manager/analyze/analysis',
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "workId": "WORK_ID_HERE",\n  "analysisType": "comprehensive"\n}',
  },
  {
    id: 'generate_draft',
    name: '📝 IP 확장 초안 생성',
    description: '설정집 기반으로 IP 확장 제안서 초안을 생성합니다.',
    method: 'POST',
    endpoint: '/api/v1/manager/ipext/proposals/ai-draft',
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "settings": ["setting_id_1", "setting_id_2"],\n  "category": "webtoon",\n  "keywords": ["action", "fantasy"]\n}',
  },
  {
    id: 'upload_manuscript',
    name: '📄 원문 파일 업로드',
    description: '분석을 위해 원문 파일을 업로드합니다. (Multipart)',
    method: 'POST',
    endpoint: '/api/v1/author/{userId}/{title}/manuscript/upload',
    headers: '{}', // Multipart/form-data is handled automatically by browser usually, but user might need to simulate
    body: '// 이 요청은 FormData 처리가 필요하므로\n// 실제 구현에서는 파일 선택 UI가 필요합니다.\n// 현재는 JSON 테스트에 최적화되어 있습니다.',
  },
];

/**
 * AILabPage (Ver 3.0 - API Developer Console)
 *
 * 🛠️ API 개발자 콘솔
 * Postman 없이도 앱 내에서 직접 백엔드 API를 테스트하고 디버깅할 수 있는 도구입니다.
 * 프로젝트의 디자인 시스템을 따르며, 자주 사용하는 AI 관련 API 템플릿을 제공합니다.
 */
export default function AILabPage() {
  // --- State Management ---
  const [method, setMethod] = useState<HttpMethod>('POST');
  const [baseUrl, setBaseUrl] = useState(
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  );
  const [endpoint, setEndpoint] = useState('/api/v1/ai/generate');
  const [headers, setHeaders] = useState(
    '{\n  "Content-Type": "application/json"\n}',
  );
  const [body, setBody] = useState('{\n  "prompt": "Hello, AI!"\n}');

  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('body');

  // --- Handlers ---

  const handleTemplateSelect = (templateId: string) => {
    const template = API_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setMethod(template.method);
      setEndpoint(template.endpoint);
      setHeaders(template.headers);
      setBody(template.body);
      toast.success(`'${template.name}' 템플릿을 불러왔습니다.`);
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseTime(null);

    const startTime = performance.now();
    const fullUrl = `${baseUrl.replace(/\/$/, '')}${endpoint}`;

    try {
      // Parse Headers
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch (e) {
        toast.error('헤더 형식이 올바르지 않은 JSON입니다.');
        setIsLoading(false);
        return;
      }

      // Add Authorization if token exists
      const token = localStorage.getItem('accessToken');
      if (token) {
        parsedHeaders = { ...parsedHeaders, Authorization: `Bearer ${token}` };
      }

      // Prepare Options
      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      // Add Body for non-GET/HEAD requests
      if (method !== 'GET') {
        try {
          // Validate JSON body
          JSON.parse(body);
          options.body = body;
        } catch (e) {
          toast.error('Body 형식이 올바르지 않은 JSON입니다.');
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(fullUrl, options);
      const endTime = performance.now();

      setResponseStatus(res.status);
      setResponseTime(Math.round(endTime - startTime));

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setResponse(data);
      } else {
        const text = await res.text();
        setResponse(text);
      }

      if (res.ok) {
        toast.success('요청이 성공했습니다.');
      } else {
        toast.error(`요청 실패: ${res.status}`);
      }
    } catch (error: any) {
      setResponse({ error: error.message });
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = (jsonString: string, setter: (val: string) => void) => {
    try {
      const parsed = JSON.parse(jsonString);
      setter(JSON.stringify(parsed, null, 2));
      toast.success('JSON 포맷팅 완료');
    } catch (e) {
      toast.error('유효하지 않은 JSON입니다.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl h-[calc(100vh-4rem)] flex flex-col gap-6 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            API Developer Console
          </h1>
          <p className="text-muted-foreground">
            백엔드 API를 직접 테스트하고 응답을 검증하는 개발자 도구입니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Documentation Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Book className="h-4 w-4" />
                사용 가이드
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>📚 API 콘솔 사용법</DialogTitle>
                <DialogDescription>
                  Postman과 유사한 방식으로 API를 테스트할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded">
                      1
                    </span>
                    템플릿 선택
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7">
                    우측 상단의 '템플릿 불러오기'에서 자주 사용되는 AI API
                    요청을 미리 불러올 수 있습니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded">
                      2
                    </span>
                    요청 설정
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7">
                    HTTP 메서드(GET, POST 등)와 URL을 확인하고, 필요한 경우
                    Body(JSON) 내용을 수정하세요. 토큰(Authorization)은 로그인
                    상태라면 자동으로 헤더에 포함됩니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary p-1 rounded">
                      3
                    </span>
                    결과 확인
                  </h3>
                  <p className="text-sm text-muted-foreground ml-7">
                    'Send Request' 버튼을 누르면 우측 패널에 응답 결과, 상태
                    코드, 소요 시간이 표시됩니다.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">확인했습니다</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="템플릿 불러오기" />
            </SelectTrigger>
            <SelectContent>
              {API_TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Main Workspace (Split View) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left: Request Panel */}
        <Card className="flex flex-col h-full border-2 border-muted/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4" /> Request
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {baseUrl}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto">
            {/* URL Bar */}
            <div className="flex gap-2">
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as HttpMethod)}
              >
                <SelectTrigger className="w-[110px] font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET" className="font-bold text-blue-500">
                    GET
                  </SelectItem>
                  <SelectItem value="POST" className="font-bold text-green-500">
                    POST
                  </SelectItem>
                  <SelectItem value="PUT" className="font-bold text-orange-500">
                    PUT
                  </SelectItem>
                  <SelectItem
                    value="PATCH"
                    className="font-bold text-yellow-500"
                  >
                    PATCH
                  </SelectItem>
                  <SelectItem value="DELETE" className="font-bold text-red-500">
                    DELETE
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="font-mono text-sm flex-1"
                placeholder="/api/v1/..."
              />
            </div>

            {/* Tabs for Body/Headers */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex items-center justify-between mb-2">
                <TabsList className="h-8">
                  <TabsTrigger value="body" className="text-xs h-7">
                    Body (JSON)
                  </TabsTrigger>
                  <TabsTrigger value="headers" className="text-xs h-7">
                    Headers
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() =>
                    activeTab === 'body'
                      ? formatJson(body, setBody)
                      : formatJson(headers, setHeaders)
                  }
                >
                  <RotateCcw className="h-3 w-3" /> Format
                </Button>
              </div>

              <TabsContent
                value="body"
                className="flex-1 mt-0 relative min-h-[200px]"
              >
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-mono text-xs leading-relaxed h-full resize-none bg-slate-950 text-slate-50 p-4 border-0 focus-visible:ring-1"
                  placeholder="{ ... }"
                />
              </TabsContent>

              <TabsContent
                value="headers"
                className="flex-1 mt-0 relative min-h-[200px]"
              >
                <Textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  className="font-mono text-xs leading-relaxed h-full resize-none bg-slate-950 text-slate-50 p-4 border-0 focus-visible:ring-1"
                  placeholder='{ "Content-Type": "application/json" }'
                />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="border-t p-4 bg-muted/10">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSendRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Send Request
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Response Panel */}
        <Card className="flex flex-col h-full border-2 border-muted/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Response
              </CardTitle>

              <div className="flex items-center gap-2">
                {responseStatus && (
                  <Badge
                    variant={
                      responseStatus >= 200 && responseStatus < 300
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    Status: {responseStatus}
                  </Badge>
                )}
                {responseTime && (
                  <Badge variant="outline" className="text-muted-foreground">
                    {responseTime}ms
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 relative bg-slate-50 dark:bg-slate-900 overflow-auto">
            {response ? (
              typeof response === 'string' &&
              (response.trim().startsWith('graph') ||
                response.trim().startsWith('sequenceDiagram') ||
                response.trim().startsWith('classDiagram')) ? (
                <div className="p-4 h-full overflow-auto bg-white">
                  <div className="mb-4 text-xs font-bold text-indigo-600 flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
                    <Code2 className="w-4 h-4" /> Mermaid Diagram Detected
                  </div>
                  <div className="flex justify-center py-4 bg-white rounded-lg border border-slate-100 shadow-sm mb-6">
                    <Mermaid chart={response} />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
                      <Code2 className="w-3 h-3" /> Original Code
                    </p>
                    <pre className="text-xs font-mono bg-slate-50 p-4 rounded-lg text-slate-600 whitespace-pre-wrap break-all border border-slate-200">
                      {response}
                    </pre>
                  </div>
                </div>
              ) : (
                <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all text-slate-800 dark:text-slate-200">
                  {typeof response === 'object'
                    ? JSON.stringify(response, null, 2)
                    : response}
                </pre>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 opacity-50">
                <HelpCircle className="h-10 w-10" />
                <p className="text-sm">
                  요청을 보내면 여기에 결과가 표시됩니다.
                </p>
              </div>
            )}
          </CardContent>

          {response && (
            <CardFooter className="border-t p-2 bg-muted/10 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(
                    typeof response === 'object'
                      ? JSON.stringify(response, null, 2)
                      : response,
                  );
                  toast.success('클립보드에 복사되었습니다.');
                }}
              >
                <Copy className="h-3 w-3" />
                Copy Response
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
