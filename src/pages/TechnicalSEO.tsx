import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Search, CheckCircle2, AlertCircle, Info, ExternalLink, FileText, Zap, ShieldCheck, Sparkles, Globe, Wrench, XCircle, AlertTriangle, LayoutTemplate, FileCode } from "lucide-react"
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

export function TechnicalSEO() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [url, setUrl] = useState("")
  const [auditData, setAuditData] = useState<any>({
    healthScore: 0,
    criticalErrors: 0,
    warnings: 0,
    elements: [],
    robotsTxt: "",
    sitemapPages: 0
  })

  const handleAnalyze = async () => {
    if (!url) return;
    
    setIsAnalyzing(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.SEO_ANALYZE}?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const result = await response.json();
      if (result) {
        setAuditData(result);
        setAnalyzed(true);
      }
    } catch (error) {
      console.error("Error generating audit data:", error);
      alert("Failed to run technical audit. Please ensure backend is running.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url_path = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url_path;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url_path);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Technical SEO</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Analyze website structure, meta tags, and generate technical files.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="url" className="text-sm font-medium">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="url" 
                  placeholder="https://example.com" 
                  className="pl-9" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !url} className="w-full md:w-auto gap-2">
              {isAnalyzing ? (
                <><Sparkles className="h-4 w-4 animate-spin" /> Scanning Website...</>
              ) : (
                <><Wrench className="h-4 w-4" /> Run Technical Audit</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyzed && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Metric Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <span className="text-xl font-bold">{auditData.healthScore}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Health Score</p>
                  <p className="text-lg font-bold">
                    {auditData.healthScore >= 90 ? "Excellent" : auditData.healthScore >= 70 ? "Good" : "Needs Work"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Critical Errors</p>
                  <p className="text-lg font-bold">{auditData.criticalErrors} Issues</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Warnings</p>
                  <p className="text-lg font-bold">{auditData.warnings} Issues</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Detailed Audit Elements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5 text-indigo-500" /> On-Page Elements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {auditData.elements.map((el: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      {el.status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
                      {el.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
                      {el.status === 'error' && <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm mb-1">{el.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">{el.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Tool Generators */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-indigo-500" /> robots.txt Generator
                  </CardTitle>
                  <CardDescription>Generated based on best practices.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono mb-4">
{auditData.robotsTxt}
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => copyToClipboard(auditData.robotsTxt)}
                  >
                    Copy robots.txt
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-500" /> sitemap.xml Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-4">Click below to generate and download a sample XML sitemap for search engines.</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={downloadSitemap}>
                    Generate & Download sitemap.xml
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
