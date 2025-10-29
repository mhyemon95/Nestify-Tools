import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const conversions = {
  length: {
    name: "Length",
    units: {
      meter: { name: "Meter", factor: 1 },
      kilometer: { name: "Kilometer", factor: 0.001 },
      centimeter: { name: "Centimeter", factor: 100 },
      millimeter: { name: "Millimeter", factor: 1000 },
      mile: { name: "Mile", factor: 0.000621371 },
      yard: { name: "Yard", factor: 1.09361 },
      foot: { name: "Foot", factor: 3.28084 },
      inch: { name: "Inch", factor: 39.3701 },
    }
  },
  weight: {
    name: "Weight",
    units: {
      kilogram: { name: "Kilogram", factor: 1 },
      gram: { name: "Gram", factor: 1000 },
      milligram: { name: "Milligram", factor: 1000000 },
      pound: { name: "Pound", factor: 2.20462 },
      ounce: { name: "Ounce", factor: 35.274 },
    }
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius" },
      fahrenheit: { name: "Fahrenheit" },
      kelvin: { name: "Kelvin" },
    }
  }
};

const UnitConverter = () => {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const convert = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("");
      return;
    }

    const categoryData = conversions[category as keyof typeof conversions];
    
    if (category === "temperature") {
      let celsius = num;
      if (fromUnit === "fahrenheit") celsius = (num - 32) * 5/9;
      if (fromUnit === "kelvin") celsius = num - 273.15;
      
      let output = celsius;
      if (toUnit === "fahrenheit") output = (celsius * 9/5) + 32;
      if (toUnit === "kelvin") output = celsius + 273.15;
      
      setResult(output.toFixed(4));
    } else {
      const units = categoryData.units as any;
      const fromFactor = units[fromUnit].factor;
      const toFactor = units[toUnit].factor;
      const baseValue = num / fromFactor;
      const convertedValue = baseValue * toFactor;
      setResult(convertedValue.toFixed(4));
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    convert(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const units = Object.keys(conversions[value as keyof typeof conversions].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue("");
    setResult("");
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement"
    >
      <div className="space-y-6">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(conversions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={(value) => { setFromUnit(value); convert(inputValue); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conversions[category as keyof typeof conversions].units).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter value"
              className="text-lg"
            />
          </div>

          <div className="space-y-3">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={(value) => { setToUnit(value); convert(inputValue); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conversions[category as keyof typeof conversions].units).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="p-3 bg-muted rounded-lg text-lg font-semibold min-h-[42px] flex items-center">
              {result || "0"}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default UnitConverter;
