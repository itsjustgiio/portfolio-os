import type { IconName } from "./registry";
import styles from "./icons.module.css";

export function Icon({
  name,
  size = "standard",
}: {
  name: IconName;
  size?: "small" | "standard" | "large";
}) {
  const mark =
    name === "recycle" || name === "recycleFull"
      ? "↻"
      : name === "shield"
        ? "✓"
        : null;
  return (
    <span
      aria-hidden="true"
      data-icon={name}
      className={`${styles.icon} ${styles[name]} ${styles[size] ?? ""}`}
    >
      <i>{mark}</i>
      <b />
    </span>
  );
}
