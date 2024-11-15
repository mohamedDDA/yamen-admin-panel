// Function to render the list of projects
async function renderProjectList() {
  const projectListContainer = document.getElementById("projectList");
  projectListContainer.innerHTML = ''; // Clear the current list

  // Fetch the data (projects array wrapped inside an array of objects)
  const response = await fetch('/api/projects');
  const data = await response.json(); // Assuming this returns an array like the one you've shown

  // Flatten all projects from all objects (if there are multiple groups of projects)
  let projects = [];
  data.forEach(group => {
    projects = [...projects, ...group.projects];
  });

  // Check if there are no projects
  if (projects.length === 0) {
    projectListContainer.innerHTML = "<p>لا توجد مشاريع حالياً.</p>";
    return;
  }

  // Loop through all projects and display them
  projects.forEach(project => {
    const projectItem = document.createElement("div");
    projectItem.classList.add("project-item");

    projectItem.innerHTML = `
      <h3>${project.title.ar}</h3>
      <button onclick="editProject('${project.id}')">تعديل</button>
      <button class="red" onclick="deleteProject('${project.id}')">حذف</button>
    `;

    projectListContainer.appendChild(projectItem);
  });
}


async function handleFormSubmit(event) {
  event.preventDefault();

  const projectData = {
    title: {
      en: document.getElementById("title_en").value,
      ar: document.getElementById("title_ar").value,
    },
    slogan: {
      en: document.getElementById("slogan_en").value,
      ar: document.getElementById("slogan_ar").value,
    },
    description: {
      en: document.getElementById("description_en").value,
      ar: document.getElementById("description_ar").value,
    },
    location: {
      en: document.getElementById("location_en").value,
      ar: document.getElementById("location_ar").value,
    },
    thumbnail: document.getElementById("thumbnail").value,
    images: document.getElementById("images").value.split("\n").map(img => img.trim()).filter(img => img),
    building_area: document.getElementById("building_area").value,
    land_area: document.getElementById("land_area").value,
    units: document.getElementById("units").value,
    latitude: document.getElementById("latitude").value,
    longitude: document.getElementById("longitude").value,
    label: {
      en: document.getElementById("label_en").value,
      ar: document.getElementById("label_ar").value
    }
  };

  // Log the data being sent
  console.log("Project Data Being Sent:", JSON.stringify(projectData, null, 2));

  const editingProjectId = window.editingProjectId;

  let response;
  if (editingProjectId) {
    response = await fetch(`/api/projects/${editingProjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });
  } else {
    response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });
  }

  const result = await response.json();

  if (response.ok) {
    showAlert('تم حفظ المشروع بنجاح!', 'success');
    resetForm();
    renderProjectList();
  } else {
    showAlert(result.message || 'حدث خطأ في حفظ المشروع.', 'error');
  }
}



async function editProject(projectId) {
  const response = await fetch(`/api/projects`);
  const data = await response.json();

  let selectedProject = null;
  data.forEach(group => {
    const project = group.projects.find(p => p.id === projectId);
    if (project) {
      selectedProject = project;
    }
  });

  if (selectedProject) {
    // Fill the form with all fields, including title, slogan, etc.
    document.getElementById("title_en").value = selectedProject.title.en;
    document.getElementById("title_ar").value = selectedProject.title.ar;
    document.getElementById("slogan_en").value = selectedProject.slogan.en;
    document.getElementById("slogan_ar").value = selectedProject.slogan.ar;
    document.getElementById("description_en").value = selectedProject.description.en;
    document.getElementById("description_ar").value = selectedProject.description.ar;
    document.getElementById("location_en").value = selectedProject.location.en;
    document.getElementById("location_ar").value = selectedProject.location.ar;
    document.getElementById("thumbnail").value = selectedProject.thumbnail;

    // Fill images list (textarea)
    document.getElementById("images").value = selectedProject.images.join("\n");

    // Fill other fields
    document.getElementById("building_area").value = selectedProject.building_area;
    document.getElementById("land_area").value = selectedProject.land_area;
    document.getElementById("units").value = selectedProject.units;
    document.getElementById("latitude").value = selectedProject.latitude;
    document.getElementById("longitude").value = selectedProject.longitude;
    document.getElementById("label_en").value = selectedProject.label.en;
    document.getElementById("label_ar").value = selectedProject.label.ar;

    // Show the cancel button and change form title
    document.getElementById("formTitle").innerText = "تعديل المشروع";
    document.getElementById("cancelBtn").style.display = "inline-block";
    document.getElementById("submitBtn").innerText = "تعديل ";
    // Set the editing project ID for submitting the update
    window.editingProjectId = selectedProject.id;

    // Optional: Update thumbnail preview
    document.getElementById("thumbnailPreview").style.display = "block";
    document.getElementById("thumbnailPreview").src = selectedProject.thumbnail;
  } else {
    showAlert('فشل في تحميل بيانات المشروع', 'error');
  }
}



// Function to delete a project
async function deleteProject(projectId) {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  
  if (response.ok) {
    showAlert('تم حذف المشروع بنجاح!', 'success');
    renderProjectList();
  } else {
    showAlert(result.message || 'حدث خطأ في حذف المشروع.', 'error');
  }
}

// Function to reset the form
function resetForm() {
  document.getElementById("projectForm").reset();
  document.getElementById("thumbnailPreview").style.display = "none";
  document.getElementById("formTitle").innerText = "إضافة مشروع جديد";
  document.getElementById("cancelBtn").style.display = "none";
  window.editingProjectId = null;
}

// Function to display alerts
function showAlert(message, type) {
  const alert = document.getElementById("alert");
  alert.innerText = message;
  alert.className = `alert ${type}`;
  setTimeout(() => {
    alert.innerText = '';
    alert.className = 'alert';
  }, 3000);
}

// Thumbnail Preview
function updateThumbnailPreview() {
  const thumbnailInput = document.getElementById("thumbnail");
  const thumbnailPreview = document.getElementById("thumbnailPreview");
  if (thumbnailInput.value) {
    thumbnailPreview.style.display = "block";
    thumbnailPreview.src = thumbnailInput.value;
  } else {
    thumbnailPreview.style.display = "none";
  }
}

// Add image input dynamically
function addImageInput() {
  const imagesTextarea = document.getElementById("images");
  const imageLinks = imagesTextarea.value.split("\n").map(link => link.trim()).filter(link => link);

  const imageList = document.getElementById("imageList");
  imageList.innerHTML = '';

  imageLinks.forEach(link => {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("image-item");
    imgDiv.innerHTML = `<img src="${link}" alt="Project Image">`;
    imageList.appendChild(imgDiv);
  });
}

// Initial render of project list
renderProjectList();
