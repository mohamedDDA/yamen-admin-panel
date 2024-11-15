document.addEventListener('DOMContentLoaded', function () {
    const addProjectBtn = document.getElementById('addProjectBtn');
    const editProjectsBtn = document.getElementById('editProjectsBtn');
    const addProjectFormContainer = document.getElementById('addProjectFormContainer');
    const editProjectsContainer = document.getElementById('editProjectsContainer');
    const editProjectFormContainer = document.getElementById('editProjectFormContainer');
    const projectsList = document.getElementById('projectsList');
    const addProjectForm = document.getElementById('addProjectForm');
    const editProjectForm = document.getElementById('editProjectForm');
    const editImagesPreview = document.getElementById('editImagesPreview');
  
    let projects = [];
  
    // Function to show "Add Project" form
    addProjectBtn.addEventListener('click', function () {
      addProjectFormContainer.style.display = 'block';
      editProjectsContainer.style.display = 'none';
      editProjectFormContainer.style.display = 'none';
    });
  
    // Function to show "Edit Projects" page
    editProjectsBtn.addEventListener('click', function () {
      addProjectFormContainer.style.display = 'none';
      editProjectsContainer.style.display = 'block';
      editProjectFormContainer.style.display = 'none';
      fetchProjects();
    });
  
    // Fetch and display the projects in the "Edit Projects" page
    async function fetchProjects() {
      try {
        const response = await fetch('https://yamen-projects-api.vercel.app/projects');
        const data = await response.json();
        projects = data.projects;
  
        projectsList.innerHTML = '';  // Clear any existing projects in the list
  
        projects.forEach((project) => {
          const projectItem = document.createElement('li');
          projectItem.innerHTML = `
            <span>${project.title.en}</span>
            <button class="edit-btn" data-id="${project.id}">تعديل</button>
            <button class="delete-btn" data-id="${project.id}">حذف</button>
          `;
          projectsList.appendChild(projectItem);
        });
  
        // Add event listeners for Edit and Delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', function () {
            const projectId = button.getAttribute('data-id');
            loadProjectForEdit(projectId);
          });
        });
  
        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', function () {
            const projectId = button.getAttribute('data-id');
            deleteProject(projectId);
          });
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  
    // Load the project details into the form for editing
    function loadProjectForEdit(projectId) {
      const project = projects.find(p => p.id === projectId);
  
      if (project) {
        document.getElementById('editTitle_en').value = project.title.en;
        document.getElementById('editTitle_ar').value = project.title.ar;
        document.getElementById('editSlogan_en').value = project.slogan.en;
        document.getElementById('editSlogan_ar').value = project.slogan.ar;
        document.getElementById('editDescription_en').value = project.description.en;
        document.getElementById('editDescription_ar').value = project.description.ar;
        document.getElementById('editLatitude').value = project.latitude;
        document.getElementById('editLongitude').value = project.longitude;
        document.getElementById('editThumbnail').value = project.thumbnail;
  
        // Clear existing image previews
        editImagesPreview.innerHTML = '';
  
        // Display image previews with delete option
        project.images.forEach((imageUrl, index) => {
          const imgPreview = document.createElement('div');
          imgPreview.innerHTML = `
            <img src="${imageUrl}" alt="Image ${index + 1}" width="100" height="100">
            <button class="delete-image-btn" data-index="${index}">حذف</button>
          `;
          editImagesPreview.appendChild(imgPreview);
        });
  
        editProjectFormContainer.style.display = 'block';
        editProjectsContainer.style.display = 'none';
      }
    }
  
    // Handle project update
    editProjectForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const updatedProject = {
        title: {
          en: document.getElementById('editTitle_en').value,
          ar: document.getElementById('editTitle_ar').value
        },
        slogan: {
          en: document.getElementById('editSlogan_en').value,
          ar: document.getElementById('editSlogan_ar').value
        },
        description: {
          en: document.getElementById('editDescription_en').value,
          ar: document.getElementById('editDescription_ar').value
        },
        latitude: document.getElementById('editLatitude').value,
        longitude: document.getElementById('editLongitude').value,
        thumbnail: document.getElementById('editThumbnail').value,
        images: [] // You can add logic to upload new images here if necessary
      };
  
      const projectId = document.getElementById('editTitle_en').getAttribute('data-id');
  
      const response = await fetch(`https://yamen-projects-api.vercel.app/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProject)
      });
  
      if (response.ok) {
        alert('تم تعديل المشروع');
        fetchProjects();
        editProjectFormContainer.style.display = 'none';
      } else {
        alert('حدث خطأ أثناء تعديل المشروع');
      }
    });
  
    // Handle project deletion
    async function deleteProject(projectId) {
      const confirmDelete = confirm('هل أنت متأكد من حذف هذا المشروع؟');
      if (confirmDelete) {
        const response = await fetch(`https://yamen-projects-api.vercel.app/projects/${projectId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert('تم حذف المشروع');
          fetchProjects();
        } else {
          alert('حدث خطأ أثناء حذف المشروع');
        }
      }
    }
  
    // Handle image deletion (just for preview in the form)
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('delete-image-btn')) {
        const index = e.target.getAttribute('data-index');
        console.log(`Delete image with index: ${index}`);  // Placeholder for image deletion logic
        e.target.parentElement.remove();
      }
    });
  
  });
  