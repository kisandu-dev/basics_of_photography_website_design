/* ==========================================================================
   Basics of Digital Photography – script.js
   Purpose: Small progressive-enhancement features for navigation and usability.
   Notes:
   - No required JavaScript for core content; the site still works without this file.
   - All behaviours are keyboard-accessible and respect user motion preferences.
   ========================================================================== */

(function () {
    "use strict";

    /* ----------------------------------------------------------------------
       Respect user’s “prefers-reduced-motion” setting for subtle animations.
       We will use this to disable non-essential JS-driven transitions.
       ---------------------------------------------------------------------- */
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------------------------------------
       1. Accessible Basics dropdown toggle
       - The CSS already shows the submenu on hover.
       - This adds explicit toggle behaviour for keyboard and touch users.
       - It updates aria-expanded so screen readers understand the state.
       ---------------------------------------------------------------------- */

    const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
        const parentItem = toggle.closest(".nav-dropdown");
        const menu = parentItem ? parentItem.querySelector(".nav-dropdown-menu") : null;

        if (!menu) return;

        // Helper function that opens or closes the dropdown
        function setOpen(isOpen) {
            toggle.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) {
                menu.classList.add("nav-dropdown-menu--open");
            } else {
                menu.classList.remove("nav-dropdown-menu--open");
            }
        }

        // Click or Enter/Space toggles menu visibility
        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            const currentlyOpen = toggle.getAttribute("aria-expanded") === "true";
            setOpen(!currentlyOpen);
        });

        // Close dropdown when focus moves away from the menu and toggle
        parentItem.addEventListener("focusout", (event) => {
            // If the newly focused element is still inside the dropdown, do nothing
            if (parentItem.contains(event.relatedTarget)) return;
            setOpen(false);
        });

        // Optional: close on Escape for power users
        parentItem.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                toggle.focus();
            }
        });
    });

    /* ----------------------------------------------------------------------
       2. Smooth scrolling enhancement for in-page anchor links
       - Browsers already jump to anchors; this only animates if motion is OK.
       - Works with the “On this page” TOC on the Basics modules.
       ---------------------------------------------------------------------- */

    const internalLinks = document.querySelectorAll('a[href^="#"]:not(.skip-link)');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href").slice(1);
            const targetEl = document.getElementById(targetId);

            // If no matching element, exit and let the browser handle it.
            if (!targetEl) return;

            // Prevent default jump; we will scroll manually.
            event.preventDefault();

            // If reduced motion is preferred, scroll instantly.
            if (prefersReducedMotion) {
                targetEl.scrollIntoView({ block: "start" });
            } else {
                targetEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            // Move focus to the target to improve accessibility for keyboard users.
            // We only adjust tabindex temporarily if the element is not normally focusable.
            const previousTabIndex = targetEl.getAttribute("tabindex");
            if (previousTabIndex === null) {
                targetEl.setAttribute("tabindex", "-1");
            }
            targetEl.focus({ preventScroll: true });

            // Clean up the temporary tabindex to avoid cluttering the tab order.
            if (previousTabIndex === null) {
                targetEl.addEventListener(
                    "blur",
                    () => {
                        targetEl.removeAttribute("tabindex");
                    },
                    { once: true }
                );
            }
        });
    });

    /* ----------------------------------------------------------------------
       3. Small “scroll to top” helper
       - Appears after the user scrolls down, providing an easy way back to the top.
       - Button is created dynamically so HTML stays clean and semantic.
       ---------------------------------------------------------------------- */

    const scrollTopButton = document.createElement("button");
    scrollTopButton.type = "button";
    scrollTopButton.className = "scroll-top-btn";
    scrollTopButton.setAttribute("aria-label", "Scroll back to top of page");
    scrollTopButton.textContent = "↑ Top";

    // Append once the DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(scrollTopButton);
    });

    // Show or hide the button based on scroll position
    window.addEventListener("scroll", () => {
        const showAfter = 280; // pixels from top
        if (window.scrollY > showAfter) {
            scrollTopButton.classList.add("scroll-top-btn--visible");
        } else {
            scrollTopButton.classList.remove("scroll-top-btn--visible");
        }
    });

    // Smoothly scroll back to the very top when the button is activated
    scrollTopButton.addEventListener("click", () => {
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        // Move focus to the body or main content wrapper so keyboard users stay oriented
        const main = document.getElementById("main-content");
        if (main) {
            main.setAttribute("tabindex", "-1");
            main.focus({ preventScroll: true });
            main.addEventListener(
                "blur",
                () => {
                    main.removeAttribute("tabindex");
                },
                { once: true }
            );
        }
    });
})();
