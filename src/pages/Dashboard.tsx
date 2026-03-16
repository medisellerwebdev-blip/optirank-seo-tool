import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowUpRight, ArrowDownRight, Activity, Users, Search, FileText, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from "../lib/utils"
import { API_ENDPOINTS } from "../config"

const initialData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 81 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 89 },
]

export function Dashboard() {
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DASHBOARD_INSIGHTS);
        if (!response.ok) throw new Error('Failed to fetch insights');
        
        const result = await response.json();
        if (result) {
          setInsights(result);
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor your overall SEO performance and recent activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89/100</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +4% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5K</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Keywords Ranked</CardTitle>
            <Search className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +84 new keywords
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Issues</CardTitle>
            <FileText className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-rose-600 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -2 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" /> AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 animate-spin" /> Analyzing performance data...
            </div>
          ) : insights ? (
            <div className="space-y-3 text-sm">
              <p className="text-slate-700 dark:text-slate-300"><strong>Summary:</strong> {insights.summary}</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Trend:</strong> {insights.trendAnalysis}</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> <strong>Recommendation:</strong> {insights.topRecommendation}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Insights could not be loaded.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>SEO Score Trend</CardTitle>
            <CardDescription>Your website's SEO health over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest optimizations and audits.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Homepage Audit", date: "2 hours ago", status: "Completed", score: 92 },
                { title: "Blog Post: AI Trends", date: "5 hours ago", status: "In Progress", score: 65 },
                { title: "Product Page Optimization", date: "Yesterday", status: "Completed", score: 88 },
                { title: "Backlink Analysis", date: "2 days ago", status: "Completed", score: 76 },
              ].map((project, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-sm">{project.title}</p>
                    <p className="text-xs text-slate-500">{project.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      project.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    )}>
                      {project.status}
                    </span>
                    <span className="text-sm font-bold w-8 text-right">{project.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
