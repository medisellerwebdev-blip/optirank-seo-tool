import React, { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Image as ImageIcon, Upload, Sparkles, Copy, Code } from "lucide-react"
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

export function MediaSEO() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [context, setContext] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [metadata, setMetadata] = useState<any>({
    fileName: "",
    altText: "",
    titleAttribute: "",
    caption: "",
    schema: ""
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setImageUrl("") // Clear URL if file is uploaded
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

  const handleGenerate = async () => {
    if (!file && !imageUrl) return;
    
    setIsGenerating(true)
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(API_ENDPOINTS.IMAGE_ANALYZE, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image file');
        }

        const result = await response.json();
        setMetadata(result);
        setGenerated(true);
      } else if (imageUrl) {
        // Simple fallback or could add URL support to backend
        alert("URL analysis not fully implemented in backend yet. Please upload a file.");
      }
    } catch (error) {
      console.error("Error generating metadata:", error);
      alert("Failed to generate metadata. Please ensure backend is running.");
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Media SEO</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Optimize images and media for better search visibility.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>Upload an image or provide a URL to generate SEO metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-4" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                <Input 
                  id="imageUrl" 
                  placeholder="https://example.com/image.jpg" 
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value) setFile(null); // Clear file if URL is provided
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="context" className="text-sm font-medium">Context (Optional)</label>
                <Input 
                  id="context" 
                  placeholder="What is this image about?" 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleGenerate} disabled={isGenerating || (!file && !imageUrl)}>
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Analyzing Image...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Generate Metadata
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={cn("h-full flex flex-col", !generated && "opacity-50 pointer-events-none")}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle>Optimized Metadata</CardTitle>
                <CardDescription>AI-generated alt text and titles</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="h-4 w-4" /> Copy All
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {generated ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Optimized File Name</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex-1">{metadata.fileName}</code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(metadata.fileName)}><Copy className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alt Text</label>
                      <div className="flex items-start gap-2 mt-1">
                        <p className="text-sm font-medium flex-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
                          {metadata.altText}
                        </p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 mt-1" onClick={() => copyToClipboard(metadata.altText)}><Copy className="h-3 w-3" /></Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Length: {metadata.altText.length} chars (Optimal: &lt; 125 chars)</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title Attribute</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={metadata.titleAttribute} readOnly className="h-8 text-sm" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(metadata.titleAttribute)}><Copy className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caption</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={metadata.caption} readOnly className="h-8 text-sm" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(metadata.caption)}><Copy className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      <Code className="h-4 w-4" /> ImageObject Schema
                    </div>
                    <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{metadata.schema}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-slate-500 min-h-[400px]">
                  <div className="space-y-4">
                    <ImageIcon className="mx-auto h-12 w-12 opacity-20" />
                    <p>Upload an image to generate optimized metadata.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
