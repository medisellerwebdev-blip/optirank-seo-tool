import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Link as LinkIcon, Search, ExternalLink, Mail, MessageSquare, TrendingUp, ShieldAlert, Copy, Sparkles } from "lucide-react"
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

export function BacklinkFinder() {
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [type, setType] = useState("All Types")
  const [backlinkData, setBacklinkData] = useState<any>(null)

  const handleSearch = async () => {
    if (!keyword) return;
    
    setIsSearching(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.BACKLINKS_FIND}?target=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error('Failed to find backlinks');
      }

      const result = await response.json();
      if (result) {
        setBacklinkData(result);
        setSearched(true);
      }
    } catch (error) {
      console.error("Error finding backlinks:", error);
      alert("Failed to find backlink opportunities. Please ensure backend is running.");
    } finally {
      setIsSearching(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Backlink Finder</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Discover high-quality backlink opportunities and outreach ideas.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium">Target Keyword or Competitor URL</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="keyword" 
                  placeholder="e.g. running shoes or https://competitor.com" 
                  className="pl-9" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Opportunity Type</label>
              <select 
                id="type" 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-indigo-600"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>All Types</option>
                <option>Guest Posts</option>
                <option>Resource Pages</option>
                <option>Broken Links</option>
                <option>Unlinked Mentions</option>
              </select>
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !keyword} className="w-full md:w-auto">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" /> Finding...
                </span>
              ) : "Find Backlinks"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && backlinkData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Total Opportunities</p>
                  <LinkIcon className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold">{backlinkData.totalOpportunities.toLocaleString()}</div>
                <p className="text-xs text-slate-500">Found for "{keyword}"</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Average DR</p>
                  <ShieldAlert className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600">{backlinkData.averageDr}</div>
                <p className="text-xs text-slate-500">Domain Rating (0-100)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Est. Traffic Potential</p>
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600">{backlinkData.estTraffic}</div>
                <p className="text-xs text-slate-500">Monthly organic traffic</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Prospect List</CardTitle>
                <CardDescription>High-quality domains relevant to your niche.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" /> Export Contacts
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Domain</th>
                      <th className="px-4 py-3 font-medium text-right">DR</th>
                      <th className="px-4 py-3 font-medium text-right">Traffic</th>
                      <th className="px-4 py-3 font-medium">Opportunity</th>
                      <th className="px-4 py-3 font-medium">Relevance</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {backlinkData.opportunities.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          {row.domain}
                          <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-500">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">{row.dr}</td>
                        <td className="px-4 py-3 text-right">{row.traffic}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                            row.type === "Guest Post" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                            row.type === "Resource Link" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" :
                            row.type === "Broken Link" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          )}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                            row.relevance === "Very High" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                            row.relevance === "High" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-500" :
                            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                          )}>
                            {row.relevance}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-indigo-600 dark:text-indigo-400">
                            <MessageSquare className="h-3 w-3" /> Outreach
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-500" /> Outreach Template: Guest Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-sm space-y-3 whitespace-pre-wrap">
                  {backlinkData.outreachTemplates.guestPost}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2" onClick={() => copyToClipboard(backlinkData.outreachTemplates.guestPost)}>
                  <Copy className="h-4 w-4" /> Copy Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4 text-rose-500" /> Outreach Template: Broken Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-sm space-y-3 whitespace-pre-wrap">
                  {backlinkData.outreachTemplates.brokenLink}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2" onClick={() => copyToClipboard(backlinkData.outreachTemplates.brokenLink)}>
                  <Copy className="h-4 w-4" /> Copy Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
