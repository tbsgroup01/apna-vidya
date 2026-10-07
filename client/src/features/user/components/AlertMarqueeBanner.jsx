import React, { useState, useEffect } from "react";
import {
  Gift,
  AlertTriangle,
  Megaphone,
  X,
  Flame,
  Wrench,
} from "lucide-react";
import api from "../../../services/api";

const getCategoryIcon = (category) => {
  switch (category) {
    case "Offer":
      return <Gift size={13} className="shrink-0" />;
    case "Festival":
      return <Flame size={13} className="shrink-0" />;
    case "Maintenance":
      return <Wrench size={13} className="shrink-0" />;
    case "Alert":
      return <AlertTriangle size={13} className="shrink-0" />;
    case "Announcement":
    default:
      return <Megaphone size={13} className="shrink-0" />;
  }
};

const getCategoryLabel = (category) => {
  switch (category) {
    case "Offer":
      return "SPECIAL OFFER";
    case "Festival":
      return "FESTIVAL WISH";
    case "Maintenance":
      return "MAINTENANCE NOTICE";
    case "Alert":
      return "IMPORTANT ALERT";
    case "Announcement":
    default:
      return "ANNOUNCEMENT";
  }
};

const AlertMarqueeBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAlerts = async () => {
      try {
        const res = await api.get("/public/alert-notifications");
        const list = res.data?.data?.alerts || [];

        if (!isMounted) return;

        // Find the first non-dismissed active alert
        const available = list.filter((item) => {
          if (item.status !== "Active") return false;
          try {
            return !sessionStorage.getItem(`apna_alert_dismissed_${item.id}`);
          } catch {
            return true;
          }
        });

        setAlerts(list);
        if (available.length > 0) {
          setActiveAlert(available[0]);
        } else {
          setActiveAlert(null);
        }
      } catch (err) {
        console.warn("Could not load alert notifications:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();

    // Re-check periodically every 60s for new announcements
    const interval = setInterval(fetchAlerts, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    if (!activeAlert) return;
    try {
      sessionStorage.setItem(`apna_alert_dismissed_${activeAlert.id}`, "true");
    } catch {}
    setIsDismissed(true);
  };

  if (loading || isDismissed || !activeAlert) {
    return null;
  }

  const isMarquee = activeAlert.isMarquee !== false;
  const speedClass =
    activeAlert.speed === "slow"
      ? "animate-marquee-slow"
      : activeAlert.speed === "fast"
      ? "animate-marquee-fast"
      : "animate-marquee-normal";

  const bannerBg = activeAlert.bgColor || "#FD8006";
  const bannerText = activeAlert.textColor || "#ffffff";

  // Single ticker message unit with icon, badge, text
  const renderMessageUnit = (indexKey) => (
    <div key={indexKey} className="inline-flex items-center gap-2.5 px-6 shrink-0">
      <span className="inline-flex items-center gap-1 rounded-md border border-white/25 bg-black/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
        {getCategoryIcon(activeAlert.category)}
        <span>{getCategoryLabel(activeAlert.category)}</span>
      </span>

      <span className="text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap">
        {activeAlert.message}
      </span>

      <span className="text-xs opacity-50 px-2 select-none">
        ✦
      </span>
    </div>
  );

  return (
    <div
      role="region"
      aria-label="Announcement banner"
      className="relative w-full overflow-hidden transition-all duration-300 z-40 shadow-xs"
      style={{ backgroundColor: bannerBg, color: bannerText }}
    >
      <div className="relative flex h-9 sm:h-10 items-center justify-between">
        {/* Left Category Indicator for Mobile/Accessibility */}
        <div className="hidden md:flex items-center pl-3 pr-2 shrink-0 border-r border-white/20 z-10">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
            {getCategoryIcon(activeAlert.category)}
            <span>{activeAlert.category}</span>
          </span>
        </div>

        {/* Center: Marquee or Static Banner */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center group">
          {isMarquee ? (
            <div className={`flex items-center whitespace-nowrap will-change-transform ${speedClass}`}>
              {/* Repeated for a seamless infinite loop ticker */}
              {renderMessageUnit("marquee-1")}
              {renderMessageUnit("marquee-2")}
              {renderMessageUnit("marquee-3")}
              {renderMessageUnit("marquee-4")}
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center gap-3 px-4 text-center">
              <span className="inline-flex items-center gap-1 rounded-md border border-white/25 bg-black/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                {getCategoryIcon(activeAlert.category)}
                <span>{getCategoryLabel(activeAlert.category)}</span>
              </span>
              <span className="text-xs sm:text-[13px] font-semibold line-clamp-1">
                {activeAlert.message}
              </span>
            </div>
          )}
        </div>

        {/* Right Dismiss Button */}
        {activeAlert.dismissible !== false && (
          <div className="flex items-center pr-2 pl-1.5 shrink-0 z-10">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-current/80 hover:text-current hover:bg-black/15 active:scale-95 transition-all cursor-pointer"
              title="Close notification for this session"
              aria-label="Close notification"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertMarqueeBanner;
