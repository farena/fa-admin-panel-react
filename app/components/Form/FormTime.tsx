import { useEffect, useRef, useState } from "react";
import "./_form_time.scss";

type FormTimeProps = {
  value: string | null; // HH:mm
  disabled?: boolean;
  onChange: (value: string) => void;
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export default function FormTime({
  value,
  disabled = false,
  onChange,
}: FormTimeProps) {
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  // Latest values, so the value effect doesn't depend on the internal state
  const current = useRef({ hour, minute });
  current.current = { hour, minute };

  const emitValue = (h: number, m: number) => {
    const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange(val);
  };

  const setNowIfEmpty = () => {
    if (current.current.hour !== null && current.current.minute !== null) {
      return;
    }

    const now = new Date();
    setHour(now.getHours());
    setMinute(now.getMinutes());
    emitValue(now.getHours(), now.getMinutes());
  };

  useEffect(() => {
    if (!value) {
      setNowIfEmpty();
      return;
    }

    const [hStr, mStr] = value.split(":");
    const h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);

    if (Number.isNaN(h) || h < 0 || h > 23) {
      setNowIfEmpty();
      return;
    }

    if (Number.isNaN(m) || m < 0 || m > 59) {
      m = 0;
    }

    setHour(h);
    setMinute(m);
  }, [value]);

  const normalizeHour = () => {
    if (hour === null || minute === null) {
      setNowIfEmpty();
      return;
    }

    const h = clamp(hour, 0, 23);
    setHour(h);
    emitValue(h, minute);
  };

  const normalizeMinute = () => {
    if (hour === null || minute === null) {
      setNowIfEmpty();
      return;
    }

    const m = clamp(minute, 0, 59);
    setMinute(m);
    emitValue(hour, m);
  };

  const parseInput = (val: string) => (val === "" ? null : Number(val));

  return (
    <div className="form-time">
      <div className="form-time-field">
        <label className="form-time-label">Hour</label>
        <input
          type="number"
          min={0}
          max={23}
          step={1}
          className="form-time-input"
          value={hour ?? ""}
          disabled={disabled}
          onChange={(e) => setHour(parseInput(e.target.value))}
          onBlur={normalizeHour}
        />
      </div>
      <div className="form-time-separator">:</div>
      <div className="form-time-field">
        <label className="form-time-label">Minute</label>
        <input
          type="number"
          min={0}
          max={59}
          step={1}
          className="form-time-input"
          value={minute ?? ""}
          disabled={disabled}
          onChange={(e) => setMinute(parseInput(e.target.value))}
          onBlur={normalizeMinute}
        />
      </div>
    </div>
  );
}
