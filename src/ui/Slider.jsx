export function Slider({ value, min, max, step, onValueChange }) {
  return (
    <input type="range" min={min} max={max} step={step} value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])} className="w-full" />
  );
}