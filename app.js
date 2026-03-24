document.addEventListener("DOMContentLoaded", () => {
    const projectsContainer = document.getElementById("projectsContainer");
    const questionInput = document.getElementById("questionInput");
    const askButton = document.getElementById("askButton");
    const responseBox = document.getElementById("responseBox");

    async function loadProjects() {
        projectsContainer.innerHTML = "Loading projects...";

        try {
            const response = await fetch("http://127.0.0.1:8001/projects");
            const projects = await response.json();

            projectsContainer.innerHTML = "";

            projects.forEach((project) => {
                const card = document.createElement("div");
                card.className = "project-card";

                const name = project.name || "Untitled Project";
                const description = project.description || "No description yet.";
                const outcome = project.outcome || "No outcome listed yet.";
                const tools = Array.isArray(project.tools) ? project.tools : [];
                const skills = Array.isArray(project.skills) ? project.skills : [];
                const steps = Array.isArray(project.steps) ? project.steps : [];

 card.innerHTML = `
    <h3>${project.name}</h3>
    <p>${project.description}</p>

    <p><strong>Outcome:</strong> ${project.outcome}</p>
    <p><strong>Tools:</strong> ${project.tools.join(", ")}</p>
    <p><strong>Skills:</strong> ${project.skills.join(", ")}</p>

    <details>
        <summary><strong>What I Did</strong></summary>
        <ul>
            ${project.steps.map(step => `<li>${step}</li>`).join("")}
        </ul>
    </details>
`;

                projectsContainer.appendChild(card);
            });
        } catch (error) {
            projectsContainer.innerHTML = "Could not load projects.";
            console.error("Project load error:", error);
        }
    }

    async function askQuestion() {
        const question = questionInput.value.trim();

        if (!question) {
            responseBox.textContent = "Please type a question.";
            return;
        }

        responseBox.textContent = "Thinking...";

        try {
            const response = await fetch("http://127.0.0.1:8001/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: question })
            });

            const data = await response.json();
            responseBox.textContent = data.answer || "No answer returned.";
        } catch (error) {
            responseBox.textContent = "Error connecting to backend.";
            console.error("Chat error:", error);
        }
    }

    askButton.addEventListener("click", askQuestion);

    questionInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            askQuestion();
        }
    });

    loadProjects();
});