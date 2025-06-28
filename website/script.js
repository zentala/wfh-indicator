// website-src/script.js

// Status ring demo animation
document.addEventListener("DOMContentLoaded", function () {
  const statusRing = document.querySelector(".status-ring");
  const statusLabel = document.querySelector(".status-label");

  if (!statusRing || !statusLabel) return;

  const statuses = [
    { class: "red", label: "On a call", color: "#ef4444" },
    { class: "orange", label: "Video meeting", color: "#f59e0b" },
    { class: "yellow", label: "Focused work", color: "#eab308" },
    { class: "green", label: "Available", color: "#10b981" },
  ];

  let currentIndex = 0;

  function updateStatus() {
    const status = statuses[currentIndex];

    // Update ring class and color
    statusRing.className = `status-ring ${status.class}`;
    statusRing.style.background = status.color;

    // Update label
    statusLabel.textContent = status.label;

    // Move to next status
    currentIndex = (currentIndex + 1) % statuses.length;
  }

  // Change status every 3 seconds
  setInterval(updateStatus, 3000);

  // Add CSS for other status colors
  const style = document.createElement("style");
  style.textContent = `
        .status-ring.orange {
            background: #f59e0b;
            animation: pulse-orange 2s infinite;
        }
        .status-ring.yellow {
            background: #eab308;
            animation: pulse-yellow 2s infinite;
        }
        .status-ring.green {
            background: #10b981;
            animation: pulse-green 2s infinite;
        }

        @keyframes pulse-orange {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        @keyframes pulse-yellow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        @keyframes pulse-green {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
  document.head.appendChild(style);

  // Initialize sidebar navigation
  initSidebar();
});

// Initialize sidebar navigation
function initSidebar() {
  // Check if specsData is available (loaded from specs-data.js)
  if (typeof specsData === "undefined") {
    console.warn("Specs data not available");
    return;
  }

  const specsMenu = document.getElementById("specs-menu");
  const homeContent = document.getElementById("home-content");
  const specsContent = document.getElementById("specs-content");

  // Populate specs menu
  for (const key in specsData) {
    const spec = specsData[key];
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    a.href = "#";
    a.className = "nav-link";
    a.dataset.spec = key;
    a.textContent = spec.title;

    li.appendChild(a);
    specsMenu.appendChild(li);
  }

  // Add event listeners to all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all links
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      if (this.dataset.page === "home") {
        // Show home content
        homeContent.classList.remove("hidden");
        specsContent.classList.add("hidden");
      } else if (this.dataset.spec) {
        // Show spec content
        homeContent.classList.add("hidden");
        specsContent.classList.remove("hidden");

        // Update spec content
        const specKey = this.dataset.spec;
        const spec = specsData[specKey];
        specsContent.innerHTML = spec.content;
      }
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add copy button to code blocks
document.querySelectorAll("pre code").forEach(function (block) {
  const button = document.createElement("button");
  button.className = "copy-btn";
  button.textContent = "Copy";
  button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        cursor: pointer;
    `;

  const pre = block.parentElement;
  pre.style.position = "relative";
  pre.appendChild(button);

  button.addEventListener("click", function () {
    navigator.clipboard.writeText(block.textContent).then(function () {
      button.textContent = "Copied!";
      setTimeout(function () {
        button.textContent = "Copy";
      }, 2000);
    });
  });
});
