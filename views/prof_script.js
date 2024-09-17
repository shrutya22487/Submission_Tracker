document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value;
    if (query.length > 0) {
        fetch(`/search_students?query=${query}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';
                data.forEach(student => {
                    const container = document.createElement('div');
                    container.className = 'tooltip-container';

                    const button = document.createElement('button');
                    button.innerText = student.name;
                    button.style = "width: 100%; padding: 10px 15px; margin-bottom: 10px; border: none; border-radius: 10px; background-color: #f9f9f9; text-align: left; font-size: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s ease;";

                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = `Add ${student.name}?`;

                    container.appendChild(button);
                    container.appendChild(tooltip);
                    container.addEventListener('click', () => {
                        selectStudent(student.id);
                    });
                    resultsDiv.appendChild(container);
                });
            })
            .catch(err => console.error('Error fetching students:', err));
    } else {
        document.getElementById('results').innerHTML = '';
    }
});

document.querySelectorAll('.archive_student_button').forEach(button => {
    button.addEventListener('click', function() {
        const studentId = this.getAttribute('data-student-id');

        fetch('/prof_dashboard/archive_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id: studentId })
        })
            .then(response => {
                if (response.ok) {
                    alert("Student archived successfully.");
                    window.location.reload();
                } else {
                    alert("Failed to archive student.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while archiving the student.");
            });
    });
});

document.querySelectorAll('.archive_job_button').forEach(button => {
    button.addEventListener('click', function() {
        const job_id = this.getAttribute('data-job-id');

        fetch('/prof_dashboard/archive_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ job_id: job_id })
        })
            .then(response => {
                if (response.ok) {
                    alert("Job archived successfully.");
                    window.location.reload();
                } else {
                    alert("Failed to archive Job.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while archiving the Job.");
            });
    });
});

// helper function
function selectStudent(student_id) {
    fetch('/prof_dashboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id }),
    })
        .then(response => {
            if (response.ok) {
                window.location.reload(); // This triggers the page reload
            } else {
                return response.text().then(text => { throw new Error(text); });
            }
        })
        .catch(err => console.error('Error selecting student:', err));
}

//deleting the student
document.querySelectorAll('.delete_student_button').forEach(button => {
    button.addEventListener('click', function() {
        const studentId = this.getAttribute('data-student-id');

        fetch('/delete_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id: studentId })
        })
            .then(response => {
                if (response.ok) {
                    alert("Student deleted successfully.");
                    window.location.reload();
                } else {
                    alert("Failed to delete student.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while deleting the student.");
            });
    });
});
