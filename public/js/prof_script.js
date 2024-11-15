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

// helper function

/////////////////////////// FUNCTIONS FOR research_project.js ////////////////////////////////////

// TODO: Check if ids are being properly captured


// adding a new job
// $(document).ready(function() {
//     $('#addJobForm').on('submit', function(event) {
//         event.preventDefault();
//
//         const formData = {
//             project_id: $('#project_id').val(),
//             title: $('#title').val(),
//             status: $('#status').val(),
//             link_1: $('#link_1').val(),
//             link_2: $('#link_2').val(),
//             submitted_date: $('#submitted_date').val(),
//             deadline_date: $('#deadline_date').val()
//         };
//
//         $.ajax({
//             type: 'POST',
//             url: '/prof_dashboard/add_job',
//             data: formData,
//             success: function(response) {
//                 alert('Job added successfully!');
//                 $('#addJobForm')[0].reset(); // Reset the form after successful submission
//             },
//             error: function(error) {
//                 console.error('Error:', error);
//                 alert('An error occurred while adding the job.');
//             }
//         });
//     });
// });

// adding a new project
// $(document).ready(function() {
//     $('#addProjectForm').on('submit', function(event) {
//         event.preventDefault();
//
//         const formData = {
//             title: $('#title').val() || null,
//             conference: $('#conference').val() || null,
//             status: $('#status').val() || null,
//             link_1: $('#link_1').val() || null,
//             link_2: $('#link_2').val() || null,
//             submitted_date: $('#submitted_date').val() || null,
//             deadline_date: $('#deadline_date').val() || null,
//             sponsored: $('#sponsored').is(':checked') || null
//         };
//
//         $.ajax({
//             type: 'POST',
//             url: '/add_project',
//             data: formData,
//             success: function(response) {
//                 alert('Project added successfully!');
//                 $('#addProjectForm')[0].reset(); // Reset the form after successful submission
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error:', error);
//                 alert('An error occurred while adding the project.');
//             }
//         });
//     });
// });

//Deleting a Project
// $(document).ready(function() {
//     $('.delete_project').on('click', function(event) {
//         event.preventDefault();
//
//         // Retrieve the project ID from a data attribute or another source
//         const project_id = $(this).data('project-id');
//
//         if (!project_id) {
//             alert('Project ID not found');
//             return;
//         }
//
//         if (confirm('Are you sure you want to delete this project?')) {
//             $.ajax({
//                 type: 'POST',
//                 url: '/delete_project',
//                 data: { project_id: project_id },
//                 success: function(response) {
//                     alert('Project deleted successfully');
//                     // Optionally, refresh the page or remove the deleted project from the DOM
//                     location.reload();
//                 },
//                 error: function(xhr, status, error) {
//                     console.error('Error:', error);
//                     alert('An error occurred while deleting the project.');
//                 }
//             });
//         }
//     });
// });

//Editing a project
// $(document).ready(function() {
//     $('.edit_project').on('click', function(event) {
//         event.preventDefault();
//
//         // Assuming that you have the necessary form fields or inputs to collect project data
//         const project_id = $(this).data('project-id');  // Fetch project ID from data attribute or a hidden input
//         const title = $('#edit_title').val() || null;
//         const conference = $('#edit_conference').val() || null;
//         const status = $('#edit_status').val() || null;
//         const link_1 = $('#edit_link_1').val() || null;
//         const link_2 = $('#edit_link_2').val() || null;
//         const submitted_date = $('#edit_submitted_date').val() || null;
//         const deadline_date = $('#edit_deadline_date').val() || null;
//         const archived = $('#edit_archived').is(':checked') || false;
//         const sponsored = $('#edit_sponsored').is(':checked') || false;
//
//         if (!project_id) {
//             alert('Project ID not found');
//             return;
//         }
//
//         $.ajax({
//             type: 'POST',
//             url: '/edit_project',
//             data: {
//                 project_id: project_id,
//                 title: title,
//                 conference: conference,
//                 status: status,
//                 link_1: link_1,
//                 link_2: link_2,
//                 submitted_date: submitted_date,
//                 deadline_date: deadline_date,
//                 archived: archived,
//                 sponsored: sponsored
//             },
//             success: function(response) {
//                 alert('Project updated successfully!');
//                 location.reload(); // Optionally, refresh the page or update the project details in the DOM
//             },
//             error: function(xhr, status, error) {
//                 console.error('Error:', error);
//                 alert('An error occurred while updating the project.');
//             }
//         });
//     });
// });
