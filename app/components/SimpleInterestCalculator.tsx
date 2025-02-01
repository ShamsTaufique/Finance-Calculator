"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(6)
  const [time, setTime] = useState(5)
  const [result, setResult] = useState<number | null>(null)

  const calculateSimpleInterest = () => {
    const p = principal
    const r = rate / 100
    const t = time
    const interest = p * r * t
    return interest
  }

  useEffect(() => {
    const interest = calculateSimpleInterest()
    setResult(interest)
  }, [principal, rate, time])

  const chartData = result
    ? [
        { name: "Principal", value: principal },
        { name: "Interest", value: result },
      ]
    : []

  const formatNumberInput = (value: string) => {
    return value.replace(/[^0-9.]/g, '')
  }

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
              className="bg-gray-200 dark:bg-gray-600"
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
              className="bg-gray-200 dark:bg-gray-600"
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
              className="bg-gray-200 dark:bg-gray-600"
            />
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