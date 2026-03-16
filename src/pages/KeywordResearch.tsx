import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Search, TrendingUp, ShieldAlert, Zap, Target, BookOpen, Layers, Copy, Sparkles, History, BarChart2, Download, HelpCircle } from "lucide-react"
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

export function KeywordResearch() {
  const [isSearching, setIsSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [seedKeyword, setSeedKeyword] = useState("")
  const [country, setCountry] = useState("United States")
  
  const [keywordData, setKeywordData] = useState<any>({
    volume: "0",
    kd: 0,
    intent: "Unknown",
    cpc: "$0.00",
    ideas: [],
    questions: [],
    clusters: []
  })

  const handleSearch = async () => {
    if (!seedKeyword) return;
    
    setIsSearching(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.KEYWORDS_RESEARCH}?keyword=${encodeURIComponent(seedKeyword)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch keyword data');
      }

      const result = await response.json();
      if (result) {
        setKeywordData(result);
        setSearched(true);
      }
    } catch (error) {
      console.error("Error generating keyword data:", error);
      alert("Failed to analyze keyword. Please ensure backend is running.");
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Keyword Research</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Discover high-value keywords, questions, and topic clusters.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="seed" className="text-sm font-medium">Seed Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="seed" 
                  placeholder="Enter a keyword..." 
                  className="pl-9" 
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label htmlFor="country" className="text-sm font-medium">Country</label>
              <select 
                id="country" 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-indigo-600"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Global</option>
              </select>
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !seedKeyword} className="w-full md:w-auto gap-2">
              {isSearching ? (
                <><Sparkles className="h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Search className="h-4 w-4" /> Analyze Keyword</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Search Volume</p>
                  <BarChart2 className="h-4 w-4 text-slate-500" />
                </div>
                <div className="text-2xl font-bold">{keywordData.volume}</div>
                <p className="text-xs text-slate-500">Monthly searches ({country === 'Global' ? 'Global' : country})</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Keyword Difficulty</p>
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  keywordData.kd > 70 ? "text-rose-600" :
                  keywordData.kd > 40 ? "text-amber-600" :
                  "text-emerald-600"
                )}>{keywordData.kd} / 100</div>
                <p className="text-xs text-slate-500">
                  {keywordData.kd > 70 ? "Hard to rank" : keywordData.kd > 40 ? "Medium difficulty" : "Easy to rank"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Search Intent</p>
                  <Search className="h-4 w-4 text-indigo-500" />
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  keywordData.intent === "Commercial" ? "text-purple-600" :
                  keywordData.intent === "Informational" ? "text-blue-600" :
                  keywordData.intent === "Transactional" ? "text-emerald-600" :
                  "text-slate-600"
                )}>{keywordData.intent}</div>
                <p className="text-xs text-slate-500">
                  {keywordData.intent === "Commercial" ? "User wants to investigate brands" :
                   keywordData.intent === "Informational" ? "User wants to learn something" :
                   keywordData.intent === "Transactional" ? "User wants to complete an action" :
                   "User wants to find a specific page"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">Cost Per Click</p>
                  <span className="text-sm font-bold text-emerald-500">$</span>
                </div>
                <div className="text-2xl font-bold">{keywordData.cpc}</div>
                <p className="text-xs text-slate-500">Average CPC</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Keyword Ideas</CardTitle>
                  <CardDescription>Related and long-tail keywords</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Keyword</th>
                        <th className="px-4 py-3 font-medium text-right">Volume</th>
                        <th className="px-4 py-3 font-medium text-right">KD</th>
                        <th className="px-4 py-3 font-medium text-right">CPC</th>
                        <th className="px-4 py-3 font-medium">Intent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {keywordData.ideas.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="px-4 py-3 font-medium">{row.keyword}</td>
                          <td className="px-4 py-3 text-right">{row.volume}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={cn(
                              "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                              row.kd > 70 ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" :
                              row.kd > 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                              "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            )}>
                              {row.kd}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">{row.cpc}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                              row.intent === "Commercial" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" :
                              row.intent === "Informational" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                              "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            )}>
                              {row.intent.charAt(0)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-500" /> Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {keywordData.questions.map((q: any, i: number) => (
                      <li key={i} className={cn(
                        "flex justify-between items-center pb-2",
                        i !== keywordData.questions.length - 1 && "border-b border-slate-100 dark:border-slate-800"
                      )}>
                        <span>{q.question}</span>
                        <span className="text-slate-500">{q.volume}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-500" /> Topic Clusters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {keywordData.clusters.map((cluster: any, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {cluster.name} ({cluster.count})
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
