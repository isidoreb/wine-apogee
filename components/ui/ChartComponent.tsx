"use client"
import { CartesianGrid, Line, LabelList, LineChart, XAxis} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  scale: {
    color: "hsl(var(--chart-2))",
  },
  windowstart: {
    color: "hsl(var(--chart-1))",
  },
  drinkstart: {
    color: "hsl(var(--chart-5))",
  },
  peakYear: {
    color: "hsl(var(--chart-2))",
  },
  drinkstop: {
    color: "hsl(var(--chart-5))",
  },
  windowstop: {
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Component({ data }) {
  // If no data is provided, use a default empty dataset
  const chartData = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wine Aging Profile</CardTitle>
        <CardDescription>Drinking Window Visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
              bottom: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="drinkstatus"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
            {/* <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="scale"
                //   hideLabel={true}
                />
              }
            /> */}
            <Line
              dataKey="scale"
              type="natural"
              stroke="var(--color-scale)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-scale)",
              }}
              activeDot={{
                r: 9,
              }}
            >
            
            <LabelList
            position="top"
            offset={10}
            className="fill-foreground"
            fontSize={12}
            dataKey="scale"
            formatter={(value: keyof typeof chartConfig) =>
                chartData[value]?.label
            }/>
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Peak drinking at {chartData.length > 0 ? chartData.find(d => d.scale === 3)?.drinkstatus || '-' : '-'}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing projected drinking window based on wine characteristics
        </div>
      </CardFooter>
    </Card>
  )
}