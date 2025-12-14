import type { Microfront } from "../../types/microfront";
import { RemotePreview } from "./RemotePreview";
import { ShellHero } from "./ShellHero";
import { GuideCard } from "./GuideCard";

type Props = {
  active: Microfront;
  refreshing: boolean;
  onRefresh: () => void;
  onNotify: () => void;
  loader: () => Promise<unknown>;
  config: unknown;
  copy: {
    hero: {
      activeLabel: string;
      remoteLabel: string;
      moduleLabel: string;
      refreshingLabel: string;
      pwaCta: string;
      notifyCta: string;
      guideTitle: string;
      guideItems: string[];
    };
    remotePreview: {
      loading: string;
      missingExport: string;
      placeholder: string;
    };
  };
};

export function ShellMain({
  active,
  refreshing,
  onRefresh,
  onNotify,
  loader,
  config,
  copy,
}: Props) {
  return (
    <main className="glass w-full flex-1 rounded-2xl p-5 shadow-lg lg:min-w-0">
      <ShellHero
        active={active}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onNotify={onNotify}
        copy={copy.hero}
      />
      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div>
          <RemotePreview
            moduleName={active.module}
            loader={loader}
            config={config}
            copy={copy.remotePreview}
          />
        </div>
        <GuideCard title={copy.hero.guideTitle} items={copy.hero.guideItems} />
      </div>
    </main>
  );
}
