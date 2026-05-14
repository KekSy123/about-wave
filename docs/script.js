const toggleBtn = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const timelineTabs = document.querySelectorAll(".timeline-tab");
const timelineViews = document.querySelectorAll(".timeline-view");
const timelineSwitch = document.querySelector(".timeline-switch");
const identityBadge = document.getElementById("identityBadge");
const timelineFlipCards = document.querySelectorAll(".timeline-card-flip");
const timelineCardStacks = document.querySelectorAll(".timeline-card-stack");
const aboutPanelFlip = document.getElementById("aboutPanelFlip");
const aboutPanelToggles = document.querySelectorAll("[data-about-panel-toggle]");
const settingsRows = document.querySelectorAll(".settings-row");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

identityBadge?.addEventListener("click", () => {
    const isFlipped = identityBadge.classList.toggle("is-flipped");
    identityBadge.setAttribute("aria-pressed", String(isFlipped));
});

const syncThemeToggleLayout = () => {
    if (!toggleBtn) {
        return;
    }

    toggleBtn.style.removeProperty("--theme-toggle-size");
    toggleBtn.style.removeProperty("--theme-toggle-icon-size");
    toggleBtn.style.removeProperty("--theme-toggle-bottom");
    toggleBtn.style.removeProperty("--theme-toggle-left");

    if (window.matchMedia("(max-width: 640px)").matches) {
        return;
    }

    const firstNavLink = navLinks[0];
    const lastNavLink = navLinks[navLinks.length - 1];

    if (!firstNavLink || !lastNavLink) {
        return;
    }

    const desiredGap = 16;
    const defaultSize = 56;
    const minSize = 42;
    const defaultBottom = 24;
    const minBottom = 12;
    const alignedLeft = Math.round(firstNavLink.getBoundingClientRect().left);
    const lastNavRect = lastNavLink.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let size = defaultSize;
    let bottom = defaultBottom;

    const getToggleTop = () => viewportHeight - bottom - size;

    while (getToggleTop() < lastNavRect.bottom + desiredGap && size > minSize) {
        size -= 2;
    }

    while (getToggleTop() < lastNavRect.bottom + desiredGap && bottom > minBottom) {
        bottom -= 2;
    }

    if (size !== defaultSize || bottom !== defaultBottom) {
        const iconSize = Math.round(size * 0.46);
        toggleBtn.style.setProperty("--theme-toggle-size", `${size}px`);
        toggleBtn.style.setProperty("--theme-toggle-icon-size", `${iconSize}px`);
        toggleBtn.style.setProperty("--theme-toggle-bottom", `${bottom}px`);
    }

    toggleBtn.style.setProperty("--theme-toggle-left", `${alignedLeft}px`);
};

const syncTimelineSwitch = (activeTab = document.querySelector(".timeline-tab.active")) => {
    if (!timelineSwitch || !activeTab) {
        return;
    }

    const tabs = Array.from(timelineTabs);
    const activeIndex = Math.max(tabs.indexOf(activeTab), 0);
    timelineSwitch.style.setProperty("--timeline-toggle-index", String(activeIndex));
};

const syncTimelineCardHeights = () => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    timelineCardStacks.forEach((stack) => {
        if (!isMobile) {
            stack.style.minHeight = "";
            return;
        }

        const faces = stack.querySelectorAll(".timeline-card");
        let maxHeight = 0;

        faces.forEach((face) => {
            maxHeight = Math.max(maxHeight, face.scrollHeight);
        });

        stack.style.minHeight = `${maxHeight}px`;
    });
};

syncThemeToggleLayout();
syncTimelineSwitch();
syncTimelineCardHeights();
window.addEventListener("resize", syncThemeToggleLayout);
window.addEventListener("resize", syncTimelineCardHeights);
window.addEventListener("load", syncThemeToggleLayout);
window.addEventListener("load", syncTimelineCardHeights);

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const targetSection = link.dataset.section;

        navLinks.forEach((item) => item.classList.remove("active"));
        sections.forEach((section) => section.classList.remove("active"));

        link.classList.add("active");
        document.querySelector(`.section[data-section="${targetSection}"]`)?.classList.add("active");
    });
});

timelineTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const targetTimeline = tab.dataset.timeline;

        timelineTabs.forEach((item) => item.classList.remove("active"));
        timelineViews.forEach((view) => view.classList.remove("active"));

        tab.classList.add("active");
        syncTimelineSwitch(tab);
        document.querySelector(`.timeline-view[data-timeline-view="${targetTimeline}"]`)?.classList.add("active");
        syncTimelineCardHeights();
    });
});

timelineFlipCards.forEach((card) => {
    card.addEventListener("click", () => {
        const timelineItem = card.closest(".timeline-item");
        timelineItem?.classList.toggle("is-flipped");
        syncTimelineCardHeights();
    });
});

aboutPanelToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const isFlipped = aboutPanelFlip?.classList.toggle("is-flipped");
        aboutPanelFlip?.setAttribute("data-panel-state", isFlipped ? "schedule" : "story");
    });

    toggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const isFlipped = aboutPanelFlip?.classList.toggle("is-flipped");
            aboutPanelFlip?.setAttribute("data-panel-state", isFlipped ? "schedule" : "story");
        }
    });
});

settingsRows.forEach((row) => {
    const value = row.querySelector("strong");
    const label = row.querySelector("span");
    const text = value?.textContent?.trim();

    if (!value || !text) {
        return;
    }

    row.setAttribute("tabindex", "0");
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `Copy ${label?.textContent?.trim() ?? "setting"} value ${text}`);

    const copyValue = async () => {
        try {
            await navigator.clipboard.writeText(text);
            row.classList.add("is-copied");
            window.setTimeout(() => {
                row.classList.remove("is-copied");
            }, 1200);
        } catch (_error) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(value);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };

    row.addEventListener("click", copyValue);
    row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            copyValue();
        }
    });
});
