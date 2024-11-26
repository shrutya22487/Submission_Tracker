async function searchStudents() {
    const query = document.getElementById('student-search').value;

    if (query.length === 0) {
        document.getElementById('student-results').innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`/search_students?query=${encodeURIComponent(query)}`);
        const students = await response.json();

        displayResults(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function displayResults(students) {

    const resultsDiv = document.getElementById('student-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    students.forEach(student => {
        const button = document.createElement('button');
        button.textContent = student.name;
        button.className = 'student-button';
        button.setAttribute('data-id', student.id);

        button.addEventListener('click', () => {
            addStudentToProfessor(student.id);
        });

        resultsDiv.appendChild(button);
    });
}

async function addStudentToProfessor(studentId) {

    try {
        const response = await fetch('/prof_dashboard/add_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({student_id: studentId})
        });

        if (response.ok) {
            alert('Student successfully added!');
            window.location.reload(); // Optional: Reload the page after successful addition
        } else {
            alert('Error adding student.');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        alert('An error occurred.');
    }
}

document.querySelectorAll('.archive_student_button').forEach(button => {
    button.addEventListener('click', function () {
        const studentId = this.getAttribute('data-student-id');

        fetch('/prof_dashboard/archive_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({student_id: studentId})
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
    button.addEventListener('click', function () {
        const job_id = this.getAttribute('data-job-id');

        fetch('/prof_dashboard/archive_job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({job_id: job_id})
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

//deleting the student
document.querySelectorAll('.delete_student_button').forEach(button => {
    button.addEventListener('click', function () {
        const studentId = this.getAttribute('data-student-id');

        fetch('/delete_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({student_id: studentId})
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
