"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import SimpleInterestCalculator from "./components/SimpleInterestCalculator"
import CompoundInterestCalculator from "./components/CompoundInterestCalculator"
import InterestComparisonChart from "./components/InterestComparisonChart"
import { Moon, Sun } from "lucide-react"

export default function FinancialCalculator() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black p-4 sm:p-6 md:p-8 flex items-center justify-center transition-colors duration-300 ${darkMode ? "dark" : ""}`}
    >
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        <div className="flex justify-between items-center py-6 px-8 bg-gray-900 dark:bg-black text-white">
          <h1 className="text-3xl font-bold">Financial Calculator</h1>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} id="dark-mode" />
            <Moon className="h-4 w-4" />
          </div>
        </div>
        <Tabs defaultValue="simple" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700">
            <TabsTrigger value="simple" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Simple Interest
            </TabsTrigger>
            <TabsTrigger value="compound" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
              Compound Interest
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              Comparison
            </TabsTrigger>
          </TabsList>
          <TabsContent value="simple">
            <SimpleInterestCalculator />
          </TabsContent>
          <TabsContent value="compound">
            <CompoundInterestCalculator />
          </TabsContent>
          <TabsContent value="comparison">
            <InterestComparisonChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

