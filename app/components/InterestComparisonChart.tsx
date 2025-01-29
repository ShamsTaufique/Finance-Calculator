"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Add type definition at the top
type CompoundFrequencyType = {
  [key: string]: number;
  Yearly: number;
  "Half-Yearly": number;
  Quarterly: number;
  Monthly: number;
}

const compoundFrequencies: CompoundFrequencyType = {
  Yearly: 1,
  "Half-Yearly": 2,
  Quarterly: 4,
  Monthly: 12,
} as const

export default function InterestComparisonChart() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(6)
  const [time, setTime] = useState(10)
  const [compoundFrequency, setCompoundFrequency] = useState("Yearly")

  const calculateInterest = useMemo(() => {
    const years = Array.from({ length: time }, (_, i) => i + 1)
    const simpleInterest = years.map((year) => principal * (1 + (rate / 100) * year))
    const compoundInterest = years.map(
      (year) =>
        principal *
        Math.pow(
          1 + rate / 100 / compoundFrequencies[compoundFrequency],
          compoundFrequencies[compoundFrequency] * year,
        ),
    )
    return { years, simpleInterest, compoundInterest }
  }, [principal, rate, time, compoundFrequency])

  const chartData = {
    labels: calculateInterest.years,
    datasets: [
      {
        label: "Simple Interest",
        data: calculateInterest.simpleInterest,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Compound Interest",
        data: calculateInterest.compoundInterest,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: "Simple vs Compound Interest Comparison",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumSignificantDigits: 3,
            }).format(Number(value)),
        },
      },
    },
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
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                ₹{principal.toLocaleString()}
              </span>
            </div>
            <Slider
              id="principal"
              min={1000}
              max={1000000}
              step={1000}
              value={[principal]}
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
              min={1}
              max={20}
              step={0.1}
              value={[rate]}
              onValueChange={(value) => setRate(value[0])}
              className="bg-gray-200 dark:bg-gray-600 [&>.relative]:dark:bg-gray-500 [&>span]:dark:bg-gray-500"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">
                Time Period (Years)
              </Label>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{time} Years</span>
            </div>
            <Slider
              id="time"
              min={1}
              max={30}
              step={1}
              value={[time]}
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
        </div>
      </div>
      <div className="h-[400px] lg:h-[400px] md:h-[500px] sm:h-[600px] bg-white dark:bg-gray-800 p-4 rounded-lg">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}

