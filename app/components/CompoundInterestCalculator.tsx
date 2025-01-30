"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Progress } from "@/components/ui/progress"
import { Printer } from "lucide-react"

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
  const [goalAmount, setGoalAmount] = useState<number>(0)

  const formatNumberInput = (value: string) => {
    // Remove all non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, '')
  }

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
        { 
          name: "Total Contributions", 
          value: principal + (additionalContribution * compoundFrequencies[contributionFrequency] * time),
          principalAmount: principal // Add this to show principal in tooltip
        },
        { name: "Interest", value: result }
      ]
    : []

  const getFunMessage = (progress: number) => {
    if (progress === 0) return "Let's get this party started! 🎈"
    if (progress < 25) return "Baby steps... we're getting there! 🐣"
    if (progress < 50) return "Almost halfway! Keep that money growing! 🌱"
    if (progress < 75) return "Look at you, money master! 💪"
    if (progress < 100) return "So close! Can you smell the money? 💰"
    return "You did it! Time to make it rain! 🌧️"
  }

  const handlePrint = () => {
    const progress = ((principal + (result || 0) + (additionalContribution * compoundFrequencies[contributionFrequency] * time)) / goalAmount * 100).toFixed(1);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Investment Summary</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                background: white;
                color: #333;
              }
              .card {
                background: #f9fafb;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .flex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 12px 0;
              }
              .label {
                color: #666;
              }
              .value {
                font-weight: 600;
              }
              .total {
                border-top: 1px solid #e5e7eb;
                margin-top: 16px;
                padding-top: 16px;
              }
              .total .value {
                font-size: 1.25rem;
                color: #111;
              }
              img {
                width: 100%;
                max-width: 400px;
                margin: 20px auto;
                display: block;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>Investment Summary</h2>
              
              <div class="flex">
                <span class="label">Principal Amount</span>
                <span class="value">₹${principal.toLocaleString()}</span>
              </div>
              <div class="flex">
                <span class="label">Interest Rate</span>
                <span class="value">${rate}%</span>
              </div>
              <div class="flex">
                <span class="label">Time Period</span>
                <span class="value">${time} Years</span>
              </div>
              <div class="flex">
                <span class="label">Compound Frequency</span>
                <span class="value">${compoundFrequency}</span>
              </div>
              ${additionalContribution > 0 ? `
                <div class="flex">
                  <span class="label">Additional Contribution</span>
                  <span class="value">₹${additionalContribution.toLocaleString()} (${contributionFrequency})</span>
                </div>
              ` : ''}

              <h3>Results</h3>
              <div class="flex">
                <span class="label">Total Interest</span>
                <span class="value">₹${result?.toLocaleString()}</span>
              </div>
              ${additionalContribution > 0 ? `
                <div class="flex">
                  <span class="label">Total Contributions</span>
                  <span class="value">₹${(additionalContribution * compoundFrequencies[contributionFrequency] * time).toLocaleString()}</span>
                </div>
              ` : ''}
              <div class="flex total">
                <span class="label">Final Amount</span>
                <span class="value">₹${(principal + (result || 0) + (additionalContribution * compoundFrequencies[contributionFrequency] * time)).toLocaleString()}</span>
              </div>
              ${goalAmount > 0 ? `
                <div class="flex">
                  <span class="label">Goal Progress</span>
                  <span class="value">${Math.min(100, Number(progress))}%</span>
                </div>
              ` : ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="principal" className="text-gray-700 dark:text-gray-300">
                Principal Amount
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-100">₹</span>
                <input
                  type="text"
                  value={principal.toLocaleString()}
                  onChange={(e) => {
                    const rawValue = formatNumberInput(e.target.value)
                    const value = Number(rawValue)
                    if (!isNaN(value)) {
                      if (value >= 0 && value <= 1000000) {
                        setPrincipal(value)
                      } else if (value > 1000000) {
                        setPrincipal(1000000)
                      } else {
                        setPrincipal(0)
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = Number(formatNumberInput(e.target.value))
                    if (value < 1000) {
                      setPrincipal(1000)
                    }
                  }}
                  className="w-24 text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rate}
                  onChange={(e) => {
                    const value = Number(formatNumberInput(e.target.value))
                    if (!isNaN(value) && value >= 0 && value <= 30) {
                      setRate(value)
                    }
                  }}
                  className="w-16 text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary"
                />
                <span className="text-gray-900 dark:text-gray-100">%</span>
              </div>
            </div>
            <Slider
              id="rate"
              value={[rate]}
              min={1}
              max={30}
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
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-100">₹</span>
                <input
                  type="text"
                  value={additionalContribution.toLocaleString()}
                  onChange={(e) => {
                    const value = Number(formatNumberInput(e.target.value))
                    if (!isNaN(value) && value >= 0 && value <= 100000) {
                      setAdditionalContribution(value)
                    }
                  }}
                  className="w-24 text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary"
                />
              </div>
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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="goal" className="text-gray-700 dark:text-gray-300">
                Investment Goal (Optional)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{goalAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              id="goal"
              value={[goalAmount]}
              min={0}
              max={10000000}
              step={100000}
              onValueChange={(value) => setGoalAmount(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
            {goalAmount > 0 && result !== null && (
              <div className="mt-4 space-y-2">
                <Progress 
                  value={(principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)) / goalAmount * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Current Progress: {Math.min(100, Number(((principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)) / goalAmount * 100).toFixed(1)))}%</span>
                  <span>Goal: ₹{goalAmount.toLocaleString()}</span>
                </div>
                {goalAmount > (principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)) && (
                  <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                    Shortfall: ₹{(goalAmount - (principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time))).toLocaleString()}
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                  {getFunMessage(
                    ((principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)) / goalAmount * 100)
                  )}
                </div>
              </div>
            )}
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
                </Pie>
                <Tooltip 
                  formatter={(value, name, entry) => {
                    if (entry && entry.payload.principalAmount !== undefined) {
                      return [
                        `Total: ₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}` +
                        `\n(Principal: ₹${Number(entry.payload.principalAmount).toLocaleString()})`
                      ]
                    }
                    return `₹${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    whiteSpace: 'pre-line'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
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
                <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              {additionalContribution > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Contributions</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    ₹{(additionalContribution * compoundFrequencies[contributionFrequency] * time).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{(principal + result + (additionalContribution * compoundFrequencies[contributionFrequency] * time)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          )}
          <Button 
            onClick={handlePrint}
            className="mt-4 w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Printer className="w-4 h-4" />
            Print Summary
          </Button>
        </Card>
      </div>
    </div>
  )
}