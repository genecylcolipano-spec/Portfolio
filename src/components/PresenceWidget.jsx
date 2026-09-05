import { useEffect, useState } from "react";
import { Music2, Code2, Gamepad2, Headphones } from "lucide-react";

// Optional live-presence feed (e.g. a small Discord/Lanyard relay).
// Leave VITE_PRESENCE_API unset and the widget simply renders nothing.
const PRESENCE_API = import.meta.env.VITE_PRESENCE_API;

const ICONS = {
  spotify: Music2,
  vscode: Code2,
  gaming: Gamepad2,
  default: Headphones,
};

const COLORS = {
  spotify: {
    bg: "from-green-500/15 to-emerald-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    dot: "bg-green-400",
    badge: "bg-green-500/20 border-green-400/40",
    glow: "shadow-green-500/20",
  },
  coding: {
    bg: "from-blue-500/15 to-indigo-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    dot: "bg-blue-400",
    badge: "bg-blue-500/20 border-blue-400/40",
    glow: "shadow-blue-500/20",
  },
  gaming: {
    bg: "from-red-500/15 to-pink-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-400",
    badge: "bg-red-500/20 border-red-400/40",
    glow: "shadow-red-500/20",
  },
  default: {
    bg: "from-purple-500/15 to-violet-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    dot: "bg-purple-400",
    badge: "bg-purple-500/20 border-purple-400/40",
    glow: "shadow-purple-500/20",
  },
};

const LABELS = {
  spotify: "NOW PLAYING",
  coding: "CODING",
  gaming: "PLAYING",
  default: "ACTIVE",
};

const normalize = (activity, idx) => {
  if (activity.type === "spotify") {
    return {
      key: `spotify-${idx}`,
      title: activity.title,
      subtitle: activity.artist,
      image: activity.image,
      type: "spotify",
      icon: "spotify",
      iconImage: activity.iconImage || null,
    };
  }

  if (activity.type === "coding") {
    return {
      key: `coding-${idx}`,
      title: activity.details || "Coding",
      subtitle: activity.state || activity.app,
      type: "coding",
      icon: "vscode",
      iconImage: activity.iconImage || null,
    };
  }

  return {
    key: `activity-${idx}`,
    title: activity.name || "Playing a Game",
    subtitle: activity.state || activity.type,
    type: activity.type || "default",
    icon: "gaming",
    iconImage: activity.iconImage || null,
  };
};

export default function PresenceWidget() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!PRESENCE_API) return;

    let cancelled = false;

    const fetchPresence = async () => {
      try {
        const res = await fetch(PRESENCE_API);
        if (!res.ok) throw new Error(`Presence API responded ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setActivities((data.activities || []).slice(0, 2).map(normalize));
      } catch {
        // Presence is a nice-to-have; stay silent and keep the widget hidden.
        if (!cancelled) setActivities([]);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!activities.length) return null;

  return (
    <div className="w-full space-y-2">
      {activities.map((act) => {
        const colors = COLORS[act.type] || COLORS.default;
        const Icon = ICONS[act.icon] || ICONS.default;

        return (
          <div key={act.key} className="group relative">
            <div
              className={`relative backdrop-blur-md bg-gradient-to-br ${colors.bg} rounded-xl border ${colors.border} ${colors.glow} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="p-3 flex items-center gap-2.5">
                {/* Artwork / icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
                    {act.image ? (
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-full h-full object-cover"
                      />
                    ) : act.iconImage ? (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <img
                          src={act.iconImage}
                          alt={act.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${colors.badge} border backdrop-blur-sm mb-1`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${colors.dot} animate-pulse`}
                    ></div>
                    <span
                      className={`text-[9px] pt-[0.5px] font-bold ${colors.text} uppercase tracking-wider`}
                    >
                      {LABELS[act.type] || LABELS.default}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-sm truncate mb-0.5">
                    {act.title}
                  </h3>
                  <p className="text-white/60 text-xs truncate">{act.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
