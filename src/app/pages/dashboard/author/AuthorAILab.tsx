import React, { useState } from 'react';
import { Mermaid } from '../../../../components/Mermaid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';

export function AuthorAILab() {
  const [graphCode, setGraphCode] = useState(`graph TD
    A[주인공] -->|친구| B(조력자)
    A -->|적대| C{빌런}
    B -->|짝사랑| A
    C -->|공격| A
    C -->|이용| B`);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">AI Lab</h1>
        <p className="text-muted-foreground">
          실험적인 기능을 테스트하는 공간입니다. 인물 관계도를 시각화해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Mermaid 코드 입력</CardTitle>
            <CardDescription>
              Mermaid 문법을 사용하여 관계도를 정의하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <Label htmlFor="code" className="sr-only">Code</Label>
            <Textarea 
              id="code"
              value={graphCode} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGraphCode(e.target.value)} 
              className="h-full font-mono text-sm resize-none"
              placeholder="graph TD..."
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-white/50 dark:bg-black/20">
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center overflow-auto min-h-0 p-4 bg-white rounded-md m-4 border">
            <Mermaid chart={graphCode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
