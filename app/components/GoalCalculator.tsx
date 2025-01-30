"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type CompoundFrequencyType = {
  [key: string]: number;
  Yearly: number;
  "Semi-Annually": number;
  Quarterly: number;
  Monthly: number;
}

const compoundFrequencies: CompoundFrequencyType = {
  Yearly: 1,
  "Semi-Annually": 2,
  Quarterly: 4,
  Monthly: 12,
} as const

export default function GoalCalculator() {
  const [targetAmount, setTargetAmount] = useState(1000000) // Target goal
  const [timeFrame, setTimeFrame] = useState(5) // Years to reach goal
  const [rate, setRate] = useState(6) // Expected return rate
  const [initialInvestment, setInitialInvestment] = useState(100000)
  const [frequency, setFrequency] = useState("Monthly")

  const calculateRequiredContribution = () => {
    const r = rate / 100
    const t = timeFrame
    const n = compoundFrequencies[frequency]
    const target = targetAmount
    const initial = initialInvestment

    // FV = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
    // Solve for PMT (periodic payment needed)
    const ratePerPeriod = r / n
    const periods = n * t
    const growthFactor = Math.pow(1 + ratePerPeriod, periods)
    
    const futureValueOfPrincipal = initial * growthFactor
    const remainingToTarget = target - futureValueOfPrincipal
    
    const pmt = (remainingToTarget * ratePerPeriod) / (growthFactor - 1)
    
    return {
      monthlyContribution: pmt,
      totalContributions: pmt * periods,
      futureValueOfPrincipal,
      totalInterest: target - initial - (pmt * periods)
    }
  }

  const [result, setResult] = useState<{
    monthlyContribution: number;
    totalContributions: number;
    futureValueOfPrincipal: number;
    totalInterest: number;
  } | null>(null)

  useEffect(() => {
    const calculation = calculateRequiredContribution()
    setResult(calculation)
  }, [targetAmount, timeFrame, rate, initialInvestment, frequency])

  const chartData = result
    ? [
        { name: "Initial Investment", value: initialInvestment },
        { name: "Required Contributions", value: result.totalContributions },
        { name: "Expected Interest", value: result.totalInterest },
      ]
    : []

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="target" className="text-gray-700 dark:text-gray-300">
                Target Amount
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{targetAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              id="target"
              value={[targetAmount]}
              min={100000}
              max={10000000}
              step={100000}
              onValueChange={(value) => setTargetAmount(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="initial" className="text-gray-700 dark:text-gray-300">
                Initial Investment
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{initialInvestment.toLocaleString()}
              </span>
            </div>
            <Slider
              id="initial"
              value={[initialInvestment]}
              min={0}
              max={targetAmount}
              step={10000}
              onValueChange={(value) => setInitialInvestment(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="timeFrame" className="text-gray-700 dark:text-gray-300">
                Time Frame (Years)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {timeFrame} Years
              </span>
            </div>
            <Slider
              id="timeFrame"
              value={[timeFrame]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => setTimeFrame(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="rate" className="text-gray-700 dark:text-gray-300">
                Expected Return Rate (%)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {rate}%
              </span>
            </div>
            <Slider
              id="rate"
              value={[rate]}
              min={1}
              max={20}
              step={0.1}
              onValueChange={(value) => setRate(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-300">
              Contribution Frequency
            </Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger
                id="frequency"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {Object.keys(compoundFrequencies).map((freq) => (
                  <SelectItem key={freq} value={freq} className="text-gray-900 dark:text-gray-100">
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <div className="h-[300px] flex items-center justify-center select-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#86efac" />
                  <Cell fill="#4ade80" />
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {result && (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Required {frequency} Contribution</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{Math.ceil(result.monthlyContribution).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Initial Investment</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{initialInvestment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Contributions</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{Math.ceil(result.totalContributions).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Expected Interest</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{Math.ceil(result.totalInterest).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Target Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{targetAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 