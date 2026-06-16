const input = document.getElementById("images");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const uploader = document.getElementById("uploader");
const previewAllBtn = document.getElementById("previewAllBtn");

/* =========================
   TOAST SYSTEM
========================= */
const toast = document.getElementById("toast");

function showToast(message, type = "info") {

    toast.textContent = message;

    toast.className = "toast show";
    toast.classList.add(type);

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================
   STATE
========================= */
let allFiles = [];
let isExpanded = false;

/* =========================
   INPUT CHANGE
========================= */
input.addEventListener("change", () => {

    preview.innerHTML = "";
    allFiles = Array.from(input.files);
    isExpanded = false;

    renderPreview();

    if (allFiles.length > 10) {
        previewAllBtn.style.display = "inline-block";
        previewAllBtn.textContent = `Preview All (${allFiles.length})`;
    } else {
        previewAllBtn.style.display = "none";
    }

    showToast(`${allFiles.length} photo(s) selected`);
});

/* =========================
   RENDER PREVIEW
========================= */
function renderPreview() {

    preview.innerHTML = "";

    const filesToShow = isExpanded
        ? allFiles
        : allFiles.slice(0, 10);

    filesToShow.forEach(file => {

        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
}

/* =========================
   TOGGLE PREVIEW BUTTON
========================= */
previewAllBtn.addEventListener("click", () => {

    isExpanded = !isExpanded;
    renderPreview();

    if (isExpanded) {
        previewAllBtn.textContent = "Show Less";
    } else {
        previewAllBtn.textContent = `Preview All (${allFiles.length})`;
    }
});

/* =========================
   UPLOAD FLOW
========================= */
uploadBtn.addEventListener("click", () => {

    if (!uploader.value.trim()) {
        uploader.focus();
        uploader.style.borderColor = "#d66";
        showToast("Please enter your name", "error");
        return;
    }

    uploader.style.borderColor = "";

    if (input.files.length === 0) {
        showToast("Please select at least one photo", "error");
        return;
    }

    showToast("Uploading memories...", "info");

    setTimeout(() => {

        showToast("Upload successful 💚 Thank you for sharing!", "success");

        input.value = "";
        preview.innerHTML = "";
        uploader.value = "";

        previewAllBtn.style.display = "none";
        allFiles = [];
        isExpanded = false;

    }, 2000);
});