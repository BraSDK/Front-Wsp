"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// 🧪 Datos mock
const chartData = [
  { month: "Ene", total: 120 },
  { month: "Feb", total: 210 },
  { month: "Mar", total: 180 },
  { month: "Abr", total: 260 },
  { month: "May", total: 300 },
  { month: "Jun", total: 280 },
]

// ⚙️ Configuración del chart
const chartConfig = {
  total: {
    label: "Usuarios",
    color: "hsl(var(--chart-1))",
  },
}

export default function Dashboard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contenido del dashboard</h2>
        <p className="text-muted-foreground">Bienvenido al sistema 🎉</p>
      </div>

      {/* 📊 Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios por mes</CardTitle>
          <CardDescription>Datos de ejemplo</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
                content={<ChartTooltipContent />}
              />

              <Area
                dataKey="total"
                type="natural"
                fill="var(--color-total)"
                fillOpacity={0.4}
                stroke="var(--color-total)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
