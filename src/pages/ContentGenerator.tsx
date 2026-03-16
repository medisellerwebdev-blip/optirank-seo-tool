import React, { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Sparkles, Copy, CheckCircle2, FileText, Link as LinkIcon, Image as ImageIcon, Code, Upload, X, FileVideo, File, Activity, Hash, LayoutPanelLeft, ChevronLeft } from "lucide-react"
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

export function ContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [keyword, setKeyword] = useState("")
  const [url, setUrl] = useState("")
  const [context, setContext] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [seoScore, setSeoScore] = useState(0)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywordSuggestions, setKeywordSuggestions] = useState<any[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = async () => {
    if (!keyword && !context && files.length === 0 && !url) return;
    
    setIsGenerating(true)
    try {
      const formData = new FormData();
      formData.append('keyword', keyword);
      formData.append('context', context);
      formData.append('url', url);
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(API_ENDPOINTS.CONTENT_GENERATE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Backend failed to process content');
      }

      const result = await response.json();
      
      if (result) {
        setGeneratedContent(result.content || "");
        setSeoScore(result.seo_score || 85);
        setMetaTitle(result.meta_title || "");
        setMetaDescription(result.meta_description || "");
        // Map backend keywords to frontend expected structure
        const mappedKeywords = (result.keywords || []).map((kw: any) => ({
          word: kw.word,
          count: kw.density, // Assuming density for now or could be count
          target: "3-5",
          status: "good"
        }));
        setKeywordSuggestions(mappedKeywords);
        setGenerated(true);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please ensure backend is running.");
    } finally {
      setIsGenerating(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4 text-blue-500" />
    if (type.startsWith('video/')) return <FileVideo className="h-4 w-4 text-purple-500" />
    return <File className="h-4 w-4 text-emerald-500" />
  }

  if (generated) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setGenerated(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Content Editor</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Review and refine your optimized content.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
                variant="outline" 
                size="sm"
                className="gap-2 flex-1 sm:flex-none"
                onClick={() => {
                    navigator.clipboard.writeText(generatedContent);
                    alert("HTML content copied to clipboard!");
                }}
            >
                <Copy className="h-4 w-4" /> Copy HTML
            </Button>
            <Button 
                size="sm"
                className="gap-2 flex-1 sm:flex-none"
                onClick={() => {
                    const blob = new Blob([generatedContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${keyword.replace(/\s+/g, '-').toLowerCase()}-seo-content.md`;
                    a.click();
                }}
            >
                <CheckCircle2 className="h-4 w-4" /> Export MD
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Editor Area */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 py-3 px-4 flex flex-row items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">H1</Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">H2</Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">H3</Button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold">B</Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs italic">I</Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs underline">U</Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-8 prose dark:prose-invert max-w-none scroll-smooth">
              <div 
                className="content-render p-2" 
                dangerouslySetInnerHTML={{ __html: generatedContent }} 
              />
            </CardContent>
          </Card>

          {/* SEO Sidebar */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  SEO Score
                  <span className="text-2xl font-bold text-emerald-500">{seoScore}<span className="text-sm text-slate-400">/100</span></span>
                </CardTitle>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mt-2">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${seoScore}%` }}></div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2"><Hash className="h-4 w-4" /> Keyword Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {keywordSuggestions.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className={cn(
                      "font-medium",
                      kw.status === 'missing' ? "text-rose-500" : "text-slate-700 dark:text-slate-300"
                    )}>{kw.word}</span>
                    <span className="text-xs text-slate-500">{kw.count} / {kw.target}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Meta Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500">Meta Title ({metaTitle.length}/60)</Label>
                  <p className="font-medium text-sm mt-1 text-indigo-600 dark:text-indigo-400">{metaTitle}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Meta Description ({metaDescription.length}/160)</Label>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{metaDescription}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4" /> AEO & Schema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold mb-1">Featured Snippet Target</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Q: What are the best running shoes for 2024?</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold mb-1 flex items-center gap-1"><Code className="h-3 w-3" /> FAQ Schema</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Generated successfully</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Internal Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Link "marathon" to <span className="text-indigo-500">/training-plans</span></li>
                  <li>Link "injury prevention" to <span className="text-indigo-500">/health/injuries</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Multimodal Content Generator</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Provide keywords, URLs, text, or media to generate highly optimized SEO/AEO content.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Parameters</CardTitle>
          <CardDescription>Fill in the details below. The more context you provide, the better the output.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="keyword">Product Name or Target Keyword</Label>
              <Input 
                id="keyword" 
                placeholder="e.g. best running shoes 2024" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL (Link Analysis)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="url" 
                  placeholder="https://example.com/blog" 
                  className="pl-9"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Text Content / Context</Label>
            <Textarea 
              id="context" 
              placeholder="Paste existing article, notes, or specific instructions here..." 
              className="h-32 resize-none" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Media Upload (Images, Videos, Documents)</Label>
            <div 
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">Support for images, videos, and PDFs</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
            
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group border border-slate-200 dark:border-slate-800 rounded-md p-2 flex items-center gap-2 bg-slate-50 dark:bg-slate-900">
                    {getFileIcon(file.type)}
                    <span className="text-xs truncate flex-1 font-medium">{file.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button className="w-full h-12 text-base" onClick={handleGenerate} disabled={isGenerating || (!keyword && !context && files.length === 0 && !url)}>
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-spin" /> Analyzing Inputs & Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Generate Optimized Content
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

