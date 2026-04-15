const toggleBtn = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const timelineTabs = document.querySelectorAll(".timeline-tab");
const timelineViews = document.querySelectorAll(".timeline-view");
const identityBadge = document.getElementById("identityBadge");

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
