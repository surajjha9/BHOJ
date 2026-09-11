/* =========================================================
   BHOJ — INTERACTIVE PROTOTYPE
========================================================= */


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function go(pageId, clickedButton = null) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });


    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active");
    }


    const sidebarButtons = document.querySelectorAll(".side-btn");

    sidebarButtons.forEach(button => {
        button.classList.remove("sel");
        button.removeAttribute("aria-current");
    });


    if (clickedButton && clickedButton.dataset.page) {
        clickedButton.classList.add("sel");
        clickedButton.setAttribute("aria-current", "page");
    } else {

        sidebarButtons.forEach(button => {

            if (button.dataset.page === pageId) {
                button.classList.add("sel");
                button.setAttribute("aria-current", "page");
            }

        });

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   TOP NAV SCROLL
========================================================= */

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (!section) {
        return;
    }


    if (section.classList.contains("page")) {

        go(sectionId);

        return;
    }


    const homePage = document.getElementById("home");

    if (homePage && !homePage.classList.contains("active")) {
        go("home");
    }


    setTimeout(() => {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   CUSTOMER SEARCH
========================================================= */

function filterBusinesses() {

    const input = document.getElementById("customerSearch");
    const grid = document.getElementById("businessGrid");


    if (!input || !grid) {
        return;
    }


    const query = input.value.trim().toLowerCase();

    const businesses = grid.querySelectorAll(".business-card");

    let visibleCount = 0;


    businesses.forEach(card => {

        const name =
            card.dataset.name ||
            card.innerText.toLowerCase();


        if (query === "" || name.includes(query)) {

            card.style.display = "flex";
            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCount === 0) {

        showToast("No local business found for your search.");

    } else if (query !== "") {

        showToast(`${visibleCount} local business found`);

    }

}


/* =========================================================
   LIVE SEARCH
========================================================= */

const searchInput = document.getElementById("customerSearch");

if (searchInput) {

    searchInput.addEventListener("input", filterBusinesses);

}


/* =========================================================
   PLACE DEMO ORDER
========================================================= */

let currentOrderNumber = null;


function place(shopName) {

    const orderTitle = document.getElementById("orderTitle");
    const orderStatus = document.getElementById("orderStatus");


    currentOrderNumber =
        "BHOJ" +
        Math.floor(1000 + Math.random() * 9000);


    if (orderTitle) {

        orderTitle.innerText =
            `${shopName} • #${currentOrderNumber}`;

    }


    if (orderStatus) {

        orderStatus.innerText = "ORDER PLACED";

        orderStatus.className = "status new";

    }


    resetTracker();


    showToast(`${shopName} order placed successfully`);


    setTimeout(() => {

        const orderPanel = document.querySelector(".order-panel");

        if (orderPanel) {

            orderPanel.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }, 150);

}


/* =========================================================
   ORDER STATUS SIMULATION
========================================================= */

const orderStatuses = [
    "Order Placed",
    "Partner Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered"
];


let currentStatusIndex = 0;


function nextStatus() {

    const statusText = document.getElementById("simulationText");


    if (currentStatusIndex < orderStatuses.length - 1) {
        currentStatusIndex++;
    } else {
        currentStatusIndex = 0;
    }


    if (statusText) {

        statusText.innerText = orderStatuses[currentStatusIndex];

    }


    updateTracker(currentStatusIndex);


    const orderStatus = document.getElementById("orderStatus");

    if (orderStatus) {

        orderStatus.innerText =
            orderStatuses[currentStatusIndex].toUpperCase();

    }


    showToast(`Order status: ${orderStatuses[currentStatusIndex]}`);

}


/* =========================================================
   RESET TRACKER
========================================================= */

function resetTracker() {

    currentStatusIndex = 0;


    const steps = document.querySelectorAll(".tracker-step");

    steps.forEach((step, index) => {

        step.classList.toggle("active", index === 0);

    });


    const simulationText = document.getElementById("simulationText");

    if (simulationText) {

        simulationText.innerText = orderStatuses[0];

    }

}


/* =========================================================
   UPDATE CUSTOMER TRACKER
========================================================= */

function updateTracker(index) {

    const steps = document.querySelectorAll(".tracker-step");

    steps.forEach((step, stepIndex) => {

        step.classList.toggle("active", stepIndex <= index);

    });

}


/* =========================================================
   DELIVERY ONLINE / OFFLINE
   Online  → RED   (button says "Go Offline")
   Offline → GREEN (button says "Go Online")
========================================================= */

let isOnline = false;


function toggleOnline() {

    const button = document.getElementById("online");

    if (!button) {
        return;
    }


    isOnline = !isOnline;


    if (isOnline) {

        /* ONLINE = RED */
        button.innerText = "Go Offline";

        button.classList.remove("offline-active");
        button.classList.add("online-active");

        showToast("You are now online for deliveries");

    } else {

        /* OFFLINE = GREEN */
        button.innerText = "Go Online";

        button.classList.remove("online-active");
        button.classList.add("offline-active");

        showToast("You are now offline");

    }

}


/* =========================================================
   DEMO MESSAGE
========================================================= */

function demoMessage(message) {

    showToast(`${message} is available in demo mode`);

}


/* =========================================================
   TOAST SYSTEM
========================================================= */

let toastTimer = null;


function showToast(message) {

    const oldToast = document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }


    const toast = document.createElement("div");

    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerText = message;


    document.body.appendChild(toast);


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.25s ease";


        setTimeout(() => {

            toast.remove();

        }, 250);

    }, 2500);

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT"
    ) {

        event.preventDefault();


        const input = document.getElementById("customerSearch");

        if (input) {

            go("customer");
            input.focus();

        }

    }


    if (event.key === "Escape") {

        const input = document.getElementById("customerSearch");

        if (input && document.activeElement === input) {
            input.blur();
        }

    }

});


/* =========================================================
   INITIAL STATE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    resetTracker();


    const home = document.getElementById("home");

    if (home) {
        home.classList.add("active");
    }


    console.log("BHOJ interactive prototype loaded successfully.");

});