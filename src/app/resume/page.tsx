import { ReadingPage } from "@/portfolio/reading";
import { ResumeViewer } from "@/portfolio/resume-viewer";

export const metadata = { title: "Resume | Giovanni OS" };

export default function ResumePage() {
  return (
    <ReadingPage title="Resume">
      <ResumeViewer />
    </ReadingPage>
  );
}
