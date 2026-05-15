import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { updateConsent } from "@/lib/analytics";

const STORAGE_KEY = "hs_consent_v1";

type Choice = { analytics: boolean; ads: boolean; ts: number };

const load = (): Choice | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Choice) : null;
  } catch {
    return null;
  }
};

const save = (c: Choice) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
};

export const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const existing = load();
    if (existing) {
      updateConsent({ analytics: existing.analytics, ads: existing.ads });
    } else {
      setVisible(true);
    }
  }, []);

  const apply = (a: boolean, ad: boolean) => {
    const choice: Choice = { analytics: a, ads: ad, ts: Date.now() };
    save(choice);
    updateConsent({ analytics: a, ads: ad });
    setVisible(false);
    setCustomizing(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-6 md:pb-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-border/60 bg-card/95 p-5 shadow-elegant backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">We use cookies</p>
            <p className="mt-1">
              We use cookies for analytics and to improve your experience. You can accept all,
              reject non-essential, or customize your choice.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:shrink-0">
            <Button variant="ghost" size="sm" onClick={() => apply(false, false)}>
              Reject all
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCustomizing(true)}>
              Customize
            </Button>
            <Button size="sm" onClick={() => apply(true, true)}>
              Accept all
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={customizing} onOpenChange={setCustomizing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which categories of cookies we may use. Essential cookies are always on.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Essential</p>
                <p className="text-xs text-muted-foreground">Required for the site to function.</p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">Helps us understand product usage.</p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Marketing</p>
                <p className="text-xs text-muted-foreground">Used to measure ad performance.</p>
              </div>
              <Switch checked={ads} onCheckedChange={setAds} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => apply(false, false)}>Reject all</Button>
            <Button onClick={() => apply(analytics, ads)}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsentBanner;
