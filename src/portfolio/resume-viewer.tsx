import { resumePdf } from "./content";
import styles from "./resume-viewer.module.css";

export function ResumeViewer({ inWindow = false }: { inWindow?: boolean }) {
  return (
    <object
      className={inWindow ? styles.window : styles.page}
      aria-label="Giovanni Carrion résumé"
      data={`${resumePdf}#page=1&view=Fit&navpanes=0`}
      type="application/pdf"
    >
      <p className={styles.fallback}>
        <a href={resumePdf} download>
          Download résumé PDF
        </a>
      </p>
    </object>
  );
}
