const toggleBtn = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const timelineTabs = document.querySelectorAll(".timeline-tab");
const timelineViews = document.querySelectorAll(".timeline-view");
const identityBadge = document.getElementById("identityBadge");
const timelineFlipCards = document.querySelectorAll(".timeline-card-flip");
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
        document.querySelector(`.timeline-view[data-timeline-view="${targetTimeline}"]`)?.classList.add("active");
    });
});

timelineFlipCards.forEach((card) => {
    card.addEventListener("click", () => {
        const timelineItem = card.closest(".timeline-item");
        timelineItem?.classList.toggle("is-flipped");
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
