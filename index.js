const githubUsername = "nadia-prince"; // غيّريها إذا تغير اسمك
const apiURL = `https://api.github.com/users/nadia-prince/repos?sort=updated`;
const projectsContainer = document.getElementById("projects-container");

async function getProjects() {
    try {
        const response = await fetch(apiURL);
        const repos = await response.json();

        if (!Array.isArray(repos)) {
            projectsContainer.innerHTML = "<p>لم أتمكن من جلب المشاريع.</p>";
            return;
        }

        repos.forEach(repo => {
            // إنشاء بطاقة المشروع
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");

            // النقر على البطاقة يفتح الريبو في نافذة جديدة
            projectCard.onclick = () => {
                window.open(repo.html_url, "_blank");
            };

            // اسم المشروع
            const title = document.createElement("div");
            title.classList.add("project-title");
            title.textContent = repo.name;

            // وصف المشروع
            const desc = document.createElement("div");
            desc.classList.add("project-desc");
            desc.textContent = repo.description || "No description available";

            // اللغات البرمجية
            const langs = document.createElement("div");
            langs.classList.add("project-langs");
            langs.textContent = "جارٍ جلب اللغات...";

            // جلب اللغات من GitHub API
            fetch(repo.languages_url)
                .then(res => res.json())
                .then(langsData => {
                    const langsList = Object.keys(langsData);
                    langs.textContent = langsList.length ? langsList.join(", ") : "No languages";
                });

            // تركيب الكرت
            projectCard.appendChild(title);
            projectCard.appendChild(desc);
            projectCard.appendChild(langs);

            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        projectsContainer.innerHTML = "<p>حدث خطأ أثناء جلب المشاريع.</p>";
        console.error(error);
    }
}

getProjects();
