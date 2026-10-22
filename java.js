const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

// Mobile navigation
menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });
});

// Search student resources
const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");

search.addEventListener("input", () => {
    const query = search.value.toLowerCase().trim();
    let found = 0;

    cards.forEach(card => {
        const content = (
            card.innerText + " " + card.dataset.search
        ).toLowerCase();

        const visible = content.includes(query);
        card.hidden = !visible;

        if (visible) found++;
    });

    noResults.hidden = found > 0;
});

// College goals checklist
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

let goals = [];

try {
    goals = JSON.parse(
        localStorage.getItem("campusGuideGoals")
    ) || [];
} catch {
    goals = [];
}

function saveGoals() {
    try {
        localStorage.setItem(
            "campusGuideGoals",
            JSON.stringify(goals)
        );
    } catch {
        // The checklist can still work during this visit.
    }
}

function renderGoals() {
    todoList.replaceChildren();

    goals.forEach((goal, index) => {
        const item = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.done;
        checkbox.setAttribute("aria-label", "Complete goal");

        checkbox.addEventListener("change", () => {
            goals[index].done = checkbox.checked;
            saveGoals();
            renderGoals();
        });

        const text = document.createElement("span");
        text.textContent = goal.text;

        if (goal.done) item.classList.add("done");

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.className = "delete-btn";
        remove.setAttribute("aria-label", "Delete goal");

        remove.addEventListener("click", () => {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        });

        item.append(checkbox, text, remove);
        todoList.appendChild(item);
    });

    const completed = goals.filter(goal => goal.done).length;

    const percent = goals.length ?
        Math.round((completed / goals.length) * 100) :
        0;

    progressText.textContent = percent + "% complete";
    progressBar.style.width = percent + "%";
}

todoForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (!text) return;

    goals.push({
        text: text,
        done: false
    });

    saveGoals();
    renderGoals();
    todoForm.reset();
    todoInput.focus();
});

renderGoals();

// Student support request
const supportForm = document.getElementById("supportForm");
const formStatus = document.getElementById("formStatus");

supportForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !topic || !message) {
        formStatus.textContent = "Please complete all fields.";
        return;
    }

    const subject = encodeURIComponent(
        "Campus Guide Support: " + topic
    );

    const body = encodeURIComponent(
        "Student Name: " + name +
        "\nEmail: " + email +
        "\nTopic: " + topic +
        "\nMessage: " + message
    );

    formStatus.textContent =
        "Opening your email application. Review the request and press Send.";

    window.location.href =
        "mailto:?subject=" + subject + "&body=" + body;
});