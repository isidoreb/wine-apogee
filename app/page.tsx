"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Component as ChartComponent } from "@/components/ui/ChartComponent";

export default function WineApogeeCalculator() {
  const [vintage, setVintage] = useState(2000);
  const [values, setValues] = useState({
    acidity: 50,
    elevage: 50,
    sugar: 50,
    quality: 50,
    terroir: 50,
    sulfites: 50,
  });
  const [formula, setFormula] = useState("(4*A + 3*S + 2*Q + 2*Sul + T + E)/20");
  const [holdingDuration, setHoldingDuration] = useState(0);
  const [chartData, setChartData] = useState([
    { drinkstatus: 1995, scale: 0, label: "" },
    { drinkstatus: 2000, scale: 1, label: "Appreciation starts"},
    { drinkstatus: 2005, scale: 3, label: "Apogee"},
    { drinkstatus: 2010, scale: 1, label: "Decline stops"},
    { drinkstatus: 2015, scale: 0, label: "" }
  ]);
  
  const computeHolding = () => {
    const { acidity: A, elevage: E, sugar: S, quality: Q, terroir: T, sulfites: Sul } = values;
    try {
      const safeEval = new Function('A', 'E', 'S', 'Q', 'T', 'Sul', `return ${formula};`);
      return Math.round(safeEval(A, E, S, Q, T, Sul));
    } catch (error) {
      console.error("Invalid formula:", error);
      return 0;
    }
  };

  useEffect(() => {
    const newHoldingDuration = computeHolding();
    setHoldingDuration(newHoldingDuration);
  }, [values, formula]);

  useEffect(() => {
    // This effect will run whenever vintage, holdingDuration, or relevant values change
    const peakYear = vintage + holdingDuration;
    const preservativeFactor = values.acidity + 0.5 * values.sulfites;
    const windowScale = preservativeFactor > 0 ? holdingDuration * (25 / preservativeFactor) : 5;
    const drinkstart = Math.round(vintage + (holdingDuration - windowScale));
    const drinkstop = Math.round(vintage + (holdingDuration + windowScale));
    const windowstart = Math.round(drinkstart - 5);
    const windowstop = Math.round(drinkstop + 5);

    // Create chart data points with additional properties for visualization
    const newChartData = [
      { drinkstatus: windowstart, scale: 0, fill: "(var(--chart-5)", label: "" },
      { drinkstatus: drinkstart, scale: 1, fill: "(var(--chart-2)", label: "Appreciation starts"},
      { drinkstatus: peakYear, scale: 3, fill: "(var(--chart-1)", label: "Apogee"},
      { drinkstatus: drinkstop, scale: 1, fill: "(var(--chart-2)", label: "Decline stops"},
      { drinkstatus: windowstop, scale: 0, fill: "(var(--chart-5)", label: "" }
    ];

    setChartData(newChartData);
  }, [vintage, holdingDuration, values.acidity, values.sulfites]);

  // Calculate these values for display, but don't store them in state
  const peakYear = vintage + holdingDuration;
  const preservativeFactor = values.acidity + 0.5 * values.sulfites;
  const windowScale = preservativeFactor > 0 ? holdingDuration * (25 / preservativeFactor) : 5;
  const drinkstart = Math.round(vintage + (holdingDuration - windowScale));
  const drinkstop = Math.round(vintage + (holdingDuration + windowScale));

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wine Apogee Calculator</h1>
      <div className="mb-4">
        <label className="block mb-1">Vintage Year</label>
        <Input 
          type="number" 
          value={vintage} 
          onChange={(e) => setVintage(Number(e.target.value))} 
        />
      </div>
      
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="mb-4">
          <label className="block mb-1 capitalize">{key}</label>
          <div className="flex items-center gap-4">
            <Slider
              value={[value]}
              min={1}
              max={100}
              step={0.1}
              onValueChange={(val) => setValues({ ...values, [key]: val[0] })}
              className="flex-1 [&_.slider-track]:h-1.5 [&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4 [&_.slider-thumb]:-translate-y-1"
            />
            <span className="w-12 text-right">{value.toFixed(1)}</span>
          </div>
        </div>
      ))}

      <div className="mb-4">
        <label className="block mb-1">Formula</label>
        <Input value={formula} onChange={(e) => setFormula(e.target.value)} />
      </div>
      
      <Card>
        <CardContent className="p-4">
          <p>Holding Duration: ~{holdingDuration} years</p>
          <p>Apogee: {peakYear}</p>
          <p>Appreciation starts: {drinkstart}</p>
          <p>Decline stops: {drinkstop}</p>
        </CardContent>
      </Card>
      
      <div className="mt-4 chart-theme">
        <ChartComponent data={chartData} />
      </div>
    </div>
  );
}