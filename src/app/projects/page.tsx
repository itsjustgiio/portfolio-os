import { PortfolioLinks, ReadingPage } from "@/portfolio/reading";
export const metadata = { title: "Portfolio | Giovanni OS" };
export default function ProjectsPage() {
  return (
    <ReadingPage title="Portfolio">
      <PortfolioLinks />
    </ReadingPage>
  );
}
