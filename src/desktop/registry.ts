import { getAiFile, type AiFileAppId } from "../portfolio/ai-projects.ts";
import { servers, type ServerId } from "../portfolio/content.ts";

export type OperatingSystem = "xp" | "kali" | "tiger";

export const operatingSystems = [
  { id: "xp", title: "Windows XP", available: true },
  { id: "kali", title: "Kali Linux", available: false },
  { id: "tiger", title: "Mac OS X Tiger", available: false },
] as const satisfies readonly {
  id: OperatingSystem;
  title: string;
  available: boolean;
}[];

export type IconName =
  | "computer"
  | "documents"
  | "network"
  | "resume"
  | "textFile"
  | "recycle"
  | "welcome"
  | "server"
  | "shield"
  | "application"
  | "briefcase"
  | "personal"
  | "recycleFull";

const serverIcons = {
  "it-infrastructure": "server",
  cybersecurity: "shield",
  "ai-projects": "application",
  professional: "briefcase",
  personal: "personal",
} as const satisfies Record<ServerId, IconName>;

const shellApps = {
  welcome: {
    title: "Welcome",
    icon: "welcome",
    route: "/about/",
    width: 540,
    height: 300,
  },
  computer: {
    title: "My Computer",
    icon: "computer",
    route: "/projects/",
    width: 600,
    height: 350,
  },
  documents: {
    title: "My Documents",
    icon: "documents",
    route: "/projects/",
    width: 600,
    height: 370,
  },
  "about-text": {
    title: "About Me.txt - Notepad",
    icon: "textFile",
    route: "/about/",
    width: 560,
    height: 300,
  },
  network: {
    title: "My Network Places",
    icon: "network",
    route: "/projects/",
    width: 720,
    height: 464,
  },
  resume: {
    title: "Resume",
    icon: "resume",
    route: "/resume/",
    width: 920,
    height: 640,
  },
  recycle: {
    title: "Recycle Bin",
    icon: "recycle",
    route: null,
    width: 450,
    height: 260,
  },
} as const;

export type AppId = keyof typeof shellApps | ServerId | AiFileAppId;

export type App = {
  id: AppId;
  title: string;
  icon: IconName;
  route: string | null;
  width: number;
  height: number;
  mobile: "panel";
};

export const desktopShortcuts = [
  "computer",
  "documents",
  "network",
  "resume",
  "recycle",
] as const satisfies readonly AppId[];

export function getApp(id: string): App | undefined {
  if (Object.hasOwn(shellApps, id)) {
    const appId = id as keyof typeof shellApps;
    return { id: appId, ...shellApps[appId], mobile: "panel" };
  }

  const aiFile = getAiFile(id);
  if (aiFile) {
    return {
      id: id as AiFileAppId,
      title:
        aiFile.file.name +
        (aiFile.kind === "text" ? " - Notepad" : " - Picture Viewer"),
      icon: aiFile.kind === "text" ? "textFile" : "personal",
      route: "/projects/ai-projects/",
      width: aiFile.kind === "text" ? 640 : 720,
      height: aiFile.kind === "text" ? 430 : 490,
      mobile: "panel",
    };
  }

  const server = servers.find((entry) => entry.id === id);
  if (server) {
    return {
      id: server.id,
      title: server.title,
      icon: serverIcons[server.id],
      route: `/projects/${server.id}/`,
      width: server.id === "ai-projects" ? 660 : 520,
      height: server.id === "ai-projects" ? 430 : 290,
      mobile: "panel",
    };
  }
}
