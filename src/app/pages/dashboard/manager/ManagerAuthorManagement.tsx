import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  BookOpen,
  Star,
  Calendar,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export function ManagerAuthorManagement() {
  interface Author {
    id: number;
    name: string;
    email: string;
    status: string;
    works: number;
    followers: string;
    rating: number;
    joinDate: string;
  }

  const [authors, setAuthors] = useState<Author[]>([]);
  const [keyword, setKeyword] = useState("");

  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL || "",
    });
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return instance;
  }, []);

  const fetchAuthors = useCallback(async () => {
    try {
      // Using Admin API to fetch authors
      const res = await authAxios.get(`/api/v1/admin/access/users`, {
        params: {
          role: "Author",
          keyword: keyword,
          page: 0,
          size: 20 // Fetch reasonable amount
        }
      });
      
      const content = res.data.content || [];
      const mappedAuthors = content.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: "active", // API doesn't provide status yet, default to active
        works: 0, // API doesn't provide works count yet
        followers: "0", // API doesn't provide followers yet
        rating: 0.0, // API doesn't provide rating yet
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"
      }));
      
      setAuthors(mappedAuthors);
    } catch (error) {
      console.error("Failed to fetch authors", error);
      setAuthors([]);
    }
  }, [authAxios, keyword]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="작가 검색..."
              className="pl-9 w-full sm:w-64"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">엑셀 다운로드</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            작가 등록
          </Button>
        </div>
      </div>

      {/* Author Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card
            key={author.id}
            className="border-slate-200 hover:shadow-lg transition-all group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage src={`/avatars/${author.id}.jpg`} />
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                      {author.name ? author.name[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {author.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {author.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">
                    작품 수
                  </div>
                  <div className="font-bold text-slate-900">
                    {author.works}
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">
                    구독자
                  </div>
                  <div className="font-bold text-slate-900">
                    {author.followers}
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">
                    평점
                  </div>
                  <div className="font-bold text-slate-900 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {author.rating}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  가입일: {author.joinDate}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Badge
                    variant={
                      author.status === "active"
                        ? "default"
                        : author.status === "warning"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      author.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : author.status === "warning"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "text-slate-500"
                    }
                  >
                    {author.status === "active"
                      ? "활동중"
                      : author.status === "warning"
                        ? "경고"
                        : "휴면"}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 text-slate-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  메시지
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-slate-600"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  작품 목록
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
