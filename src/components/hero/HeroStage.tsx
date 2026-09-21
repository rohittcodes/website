import styles from "./HeroStage.module.scss";

function Cursor({ label, tone }: { label: string; tone: "brand" | "accent" }) {
  return (
    <span className={`${styles.cursor} ${styles[tone]}`}>
      <svg viewBox="0 0 24 24" aria-hidden className={styles.pointer}>
        <path d="M5.2 3.1 19 12.4l-6.6 1.4 2.6 6.5-2.8 1.1-2.6-6.4-4.8 4.1Z" />
      </svg>
      <span className={styles.cursorLabel}>{label}</span>
    </span>
  );
}

export function HeroStage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.cluster}>
        <div className={styles.stage} aria-hidden>
          <div className={`${styles.item} ${styles.itemA}`}>
            <Cursor label="Rohith" tone="brand" />
            <div className={styles.card}>
              <span className={styles.cardKicker}>Linea</span>
              <span className={styles.cardBody}>workflow running</span>
            </div>
          </div>

          <div className={`${styles.item} ${styles.itemB}`}>
            <Cursor label="createxp" tone="accent" />
            <div className={styles.card}>
              <span className={styles.cardKicker}>NovaBench</span>
              <span className={styles.cardBody}>184ms streamed</span>
            </div>
          </div>

          <div className={`${styles.item} ${styles.itemC}`}>
            <span className={styles.chip}>pgvector · hybrid</span>
          </div>

          <div className={`${styles.item} ${styles.itemD}`}>
            <Cursor label="agent" tone="brand" />
            <span className={styles.chip}>tool call · slack</span>
          </div>
        </div>
        <div className={styles.center}>{children}</div>
      </div>
    </div>
  );
}
