let editingJobId = null;

// Load all jobs
async function loadJobs() {
    const response = await fetch("/jobs");
    const jobs = await response.json();
    displayJobs(jobs);
}

// Display jobs in UI
function displayJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    jobs.forEach(job => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${job.title}</strong> - ${job.company} (${job.location})
            <br>
            ${job.description}
            <br>
            <small>Posted on: ${job.postedDate || "N/A"}</small>
            <br>
            <button onclick="editJob(${job.id}, '${job.title}', '${job.company}', '${job.location}', '${job.description}')">
                Edit
            </button>
            <button onclick="deleteJob(${job.id})">
                Delete
            </button>
            <hr>
        `;
        jobList.appendChild(li);
    });
}

// Add or Update job
document.getElementById("jobForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const job = {
        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        location: document.getElementById("location").value,
        description: document.getElementById("description").value
    };

    if (editingJobId === null) {
        // ADD job
        await fetch("/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(job)
        });
    } else {
        // UPDATE job
        await fetch(`/jobs/${editingJobId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(job)
        });
        editingJobId = null;
    }

    // Reset form
    document.getElementById("jobForm").reset();

    // Reload jobs
    loadJobs();
});

// Fill form for editing
function editJob(id, title, company, location, description) {
    document.getElementById("title").value = title;
    document.getElementById("company").value = company;
    document.getElementById("location").value = location;
    document.getElementById("description").value = description;

    editingJobId = id;
}

// Delete job
async function deleteJob(id) {
    await fetch(`/jobs/${id}`, {
        method: "DELETE"
    });
    loadJobs();
}

// Search jobs by title
async function searchJobs() {
    const title = document.getElementById("searchTitle").value;

    if (title.trim() === "") {
        loadJobs();
        return;
    }

    const response = await fetch(`/jobs/search?title=${title}`);
    const jobs = await response.json();

    displayJobs(jobs);
}

// Load jobs when page opens
loadJobs();
