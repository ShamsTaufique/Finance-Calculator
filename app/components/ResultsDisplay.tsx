import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsDisplayProps {
  principal: number
  interest: number
}

export default function ResultsDisplay({ principal, interest }: ResultsDisplayProps) {
  const totalAmount = principal + interest

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${principal.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${interest.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalAmount.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

