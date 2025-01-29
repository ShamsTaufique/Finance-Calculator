"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(6)
  const [time, setTime] = useState(5)
  const [compoundFrequency, setCompoundFrequency] = useState("1")
  const [result, setResult] = useState<number | null>(null)

  const calculateCompoundInterest = () => {
    const p = principal
    const r = rate / 100
    const t = time
    const n = Number.parseFloat(compoundFrequency)
    const amount = p * Math.pow(1 + r / n, n * t)
    const interest = amount - p
    return interest
  }

  useEffect(() => {
    const interest = calculateCompoundInterest()
    setResult(interest)
  }, [principal, rate, time, compoundFrequency, calculateCompoundInterest])

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
              className="bg-gray-200 dark:bg-gray-700"
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
              className="bg-gray-200 dark:bg-gray-700"
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
              className="bg-gray-200 dark:bg-gray-700"
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
                <SelectItem value="1" className="text-gray-900 dark:text-gray-100">
                  Annually
                </SelectItem>
                <SelectItem value="2" className="text-gray-900 dark:text-gray-100">
                  Semi-Annually
                </SelectItem>
                <SelectItem value="4" className="text-gray-900 dark:text-gray-100">
                  Quarterly
                </SelectItem>
                <SelectItem value="12" className="text-gray-900 dark:text-gray-100">
                  Monthly
                </SelectItem>
                <SelectItem value="365" className="text-gray-900 dark:text-gray-100">
                  Daily
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <div className="h-[300px] flex items-center justify-center">
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
                  <Cell fill="#4F46E5" />
                  <Cell fill="#818CF8" />
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
                <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ₹{result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{(principal + result).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

