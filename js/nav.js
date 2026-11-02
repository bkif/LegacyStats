const NAV_ITEMS = [
    { href: "./index.html", label: "Accueil" },
    { href: "#", label: "Cartes" },
    { href: "#", label: "Fiches" },
    { href: "#", label: "Nouveautés" },
    { href: "#", label: "E-sport" },
    { href: "#", label: "CRL" },
    { href: "#", label: "Contact" },
    { href: "https://www.youtube.com/@mhlgcr_off", label: "YouTube", external: true },
];

document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    const current = location.pathname.split("/").pop() || "index.html";
    nav.innerHTML = NAV_ITEMS.map(({ href, label, external }) => {
        const isCurrent = href.endsWith(current);
        const ext = external ? ' target="_blank" rel="noopener"' : "";
        const cur = isCurrent ? ' aria-current="page"' : "";
        return `<a href="${href}"${cur}${ext}>${label}${external ? '<span class="sr"> (nouvel onglet)</span>' : ""}</a>`;
    }).join("");
});