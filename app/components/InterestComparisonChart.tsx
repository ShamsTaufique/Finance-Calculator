"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComparisonData {
  year: number;
  compoundInterest: number;
  simpleInterest: number;
  conservative: number;  // Lower rate
  aggressive: number;   // Higher rate
}

export default function InterestComparisonChart() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(6)
  const [time, setTime] = useState(5)
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [showSimple, setShowSimple] = useState(true)
  const [showCompound, setShowCompound] = useState(true)
  const [showConservative, setShowConservative] = useState(true)
  const [showAggressive, setShowAggressive] = useState(true)

  const calculateComparison = () => {
    const data: ComparisonData[] = []
    
    for (let year = 0; year <= time; year++) {
      // Simple Interest
      const simpleInterest = principal * (rate / 100) * year
      
      // Compound Interest
      const compoundInterest = principal * (Math.pow(1 + rate / 100, year) - 1)
      
      // Conservative (fixed 6%)
      const conservative = principal * (Math.pow(1 + 6 / 100, year) - 1)
      
      // Aggressive (fixed 15%)
      const aggressive = principal * (Math.pow(1 + 15 / 100, year) - 1)
      
      data.push({
        year,
        simpleInterest: Math.round(simpleInterest),
        compoundInterest: Math.round(compoundInterest),
        conservative: Math.round(conservative),
        aggressive: Math.round(aggressive)
      })
    }
    
    setComparisonData(data)
  }

  useEffect(() => {
    calculateComparison()
  }, [principal, rate, time])

  return (
    <Card className="p-4 md:p-6">
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger 
            value="chart" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Chart View
          </TabsTrigger>
          <TabsTrigger 
            value="table" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Table View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showSimple}
                onChange={(e) => setShowSimple(e.target.checked)}
                className="rounded border-gray-300 text-primary"
              />
              <span className="text-gray-600 dark:text-gray-400">Simple Interest</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showCompound}
                onChange={(e) => setShowCompound(e.target.checked)}
                className="rounded border-gray-300 text-primary"
              />
              <span className="text-gray-600 dark:text-gray-400">Compound Interest</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showConservative}
                onChange={(e) => setShowConservative(e.target.checked)}
                className="rounded border-gray-300 text-primary"
              />
              <span className="text-gray-600 dark:text-gray-400">Conservative (6%)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showAggressive}
                onChange={(e) => setShowAggressive(e.target.checked)}
                className="rounded border-gray-300 text-primary"
              />
              <span className="text-gray-600 dark:text-gray-400">Aggressive (15%)</span>
            </label>
          </div>
          <div className="h-[350px] sm:h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  label={{ 
                    value: 'Years', 
                    position: 'bottom',
                    offset: 0,
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                  tick={{ fontSize: 12 }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Amount (₹)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 12 },
                    offset: 10
                  }}
                  tickFormatter={(value) => `₹${(value/1000)}K`}
                  tick={{ fontSize: 12 }}
                  width={80}
                  padding={{ top: 20, bottom: 20 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{
                    fontSize: '12px',
                    padding: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={50}
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                    bottom: '0px'
                  }}
                  iconSize={10}
                  iconType="plainline"
                  layout="horizontal"
                  margin={{ top: 20 }}
                />
                {showSimple && (
                  <Line 
                    type="monotone" 
                    dataKey="simpleInterest" 
                    stroke="#3b82f6" 
                    name="Simple Interest"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {showCompound && (
                  <Line 
                    type="monotone" 
                    dataKey="compoundInterest" 
                    stroke="#22c55e" 
                    name="Compound Interest"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {showConservative && (
                  <Line 
                    type="monotone" 
                    dataKey="conservative" 
                    stroke="#f59e0b" 
                    name="Conservative (Lower Risk)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {showAggressive && (
                  <Line 
                    type="monotone" 
                    dataKey="aggressive" 
                    stroke="#ef4444" 
                    name="Aggressive (Higher Risk)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-1 px-2">
            <p>• Conservative: Shows returns at 6% (lower risk investments)</p>
            <p>• Aggressive: Shows returns at 15% (higher risk investments)</p>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2 sticky left-0 bg-white dark:bg-gray-800">Year</th>
                  <th className="text-right p-2 min-w-[120px]">Simple Interest</th>
                  <th className="text-right p-2 min-w-[120px]">Compound Interest</th>
                  <th className="text-right p-2 min-w-[120px]">Conservative</th>
                  <th className="text-right p-2 min-w-[120px]">Aggressive</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((data) => (
                  <tr key={data.year} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2 sticky left-0 bg-white dark:bg-gray-800">{data.year}</td>
                    <td className="text-right p-2">₹{data.simpleInterest.toLocaleString()}</td>
                    <td className="text-right p-2">₹{data.compoundInterest.toLocaleString()}</td>
                    <td className="text-right p-2">₹{data.conservative.toLocaleString()}</td>
                    <td className="text-right p-2">₹{data.aggressive.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 space-y-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label>Principal Amount: ₹{principal.toLocaleString()}</Label>
          <Slider
            value={[principal]}
            min={1000}
            max={1000000}
            step={1000}
            onValueChange={(value) => setPrincipal(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Interest Rate: {rate}%</Label>
          <Slider
            value={[rate]}
            min={1}
            max={30}
            step={0.1}
            onValueChange={(value) => setRate(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Time Period: {time} Years</Label>
          <Slider
            value={[time]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setTime(value[0])}
          />
        </div>
      </div>
    </Card>
  )
}

