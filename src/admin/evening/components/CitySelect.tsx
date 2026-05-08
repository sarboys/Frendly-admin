import { ADMIN_RUSSIA_MILLION_CITIES } from "../cities";

type CitySelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export const CitySelect = ({ label, value, onChange, required }: CitySelectProps) => (
  <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
    <span>{label}</span>
    <select
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
    >
      {ADMIN_RUSSIA_MILLION_CITIES.map((city) => (
        <option key={city.name} value={city.name}>
          {city.name}
        </option>
      ))}
    </select>
  </label>
);
