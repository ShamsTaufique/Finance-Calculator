"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// First, add the type definition
type CompoundFrequencyType = {
  [key: string]: number;
  Yearly: number;
  "Semi-Annually": number;
  Quarterly: number;
  Monthly: number;
  Daily: number;
}

// Define the frequencies object
const compoundFrequencies: CompoundFrequencyType = {
  Yearly: 1,
  "Semi-Annually": 2,
  Quarterly: 4,
  Monthly: 12,
  Daily: 365,
} as const

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(6)
  const [time, setTime] = useState(5)
  const [compoundFrequency, setCompoundFrequency] = useState("Yearly")
  const [additionalContribution, setAdditionalContribution] = useState(0)
  const [contributionFrequency, setContributionFrequency] = useState("Monthly")
  const [result, setResult] = useState<number | null>(null)

  const calculateCompoundInterest = () => {
    const p = principal
    const r = rate / 100
    const t = time
    const n = compoundFrequencies[compoundFrequency]  // compound frequency
    const pmt = additionalContribution // contribution amount
    const contributionFreq = compoundFrequencies[contributionFrequency] // contribution frequency
    
    let totalAmount = p
    const paymentsPerYear = contributionFreq
    const ratePerPeriod = r / n
    
    // Calculate for each year
    for (let year = 0; year < t; year++) {
      // First compound the current amount
      totalAmount = totalAmount * Math.pow(1 + ratePerPeriod, n)
      
      // Add contributions at the end of each period
      for (let payment = 0; payment < paymentsPerYear; payment++) {
        // Calculate remaining periods after this contribution until year end
        const periodsRemaining = n * ((paymentsPerYear - 1 - payment) / paymentsPerYear)
        // Add contribution and compound it for remaining periods
        const contributionWithInterest = pmt * Math.pow(1 + ratePerPeriod, periodsRemaining)
        totalAmount += contributionWithInterest
      }
    }

    const totalContributions = pmt * paymentsPerYear * t
    const interest = totalAmount - p - totalContributions
    return interest
  }

  useEffect(() => {
    const interest = calculateCompoundInterest()
    setResult(interest)
  }, [principal, rate, time, compoundFrequency, additionalContribution, contributionFrequency, calculateCompoundInterest])

  const chartData = result
    ? [
        { name: "Principal", value: principal },
        { name: "Interest", value: result },
      ]
    : []

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="principal" className="text-gray-700 dark:text-gray-300">
                Principal Amount
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{principal.toLocaleString()}
              </span>
            </div>
            <Slider
              id="principal"
              value={[principal]}
              min={1000}
              max={1000000}
              step={1000}
              onValueChange={(value) => setPrincipal(value[0])}
             className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="rate" className="text-gray-700 dark:text-gray-300">
                Interest Rate (%)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rate}%</span>
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
            <div className="flex justify-between items-center">
              <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                Time Period (Years)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{time} Years</span>
            </div>
            <Slider
              id="time"
              value={[time]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => setTime(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
/>
          </div>

          <div className="space-y-4">
            <Label htmlFor="compound-frequency" className="text-gray-700 dark:text-gray-300">
              Compound Frequency
            </Label>
            <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
              <SelectTrigger
                id="compound-frequency"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {Object.keys(compoundFrequencies).map((frequency) => (
                  <SelectItem key={frequency} value={frequency} className="text-gray-900 dark:text-gray-100">
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="additional-contribution" className="text-gray-700 dark:text-gray-300">
                Additional Contribution
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{additionalContribution.toLocaleString()}
              </span>
            </div>
            <Slider
              id="additional-contribution"
              value={[additionalContribution]}
              min={0}
              max={100000}
              step={1000}
              onValueChange={(value) => setAdditionalContribution(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="contribution-frequency" className="text-gray-700 dark:text-gray-300">
              Contribution Frequency
            </Label>
            <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
              <SelectTrigger
                id="contribution-frequency"
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {Object.keys(compoundFrequencies).map((frequency) => (
                  <SelectItem key={frequency} value={frequency} className="text-gray-900 dark:text-gray-100">
                    {frequency}
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
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#86efac" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {result !== null && (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Principal Amount</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{principal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Contributions</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{(additionalContribution * compoundFrequencies[contributionFrequency] * time).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{(principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

