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
const scriptURL = "https://script.google.com/macros/s/AKfycbwhvpQXMZn_4rAXxON983iPB6_yXdz6nj6nYpz1obB3o-e661ytQw48Y5RjGChqtblfWQ/exec";

/* =========================
   ATTACH REAL UPLOAD
========================= */
uploadBtn.onclick = uploadFiles;

/* =========================
   UPLOAD CONTROLLER
========================= */
async function uploadFiles() {

    uploadBtn.disabled = true;

    try {

        const files = input.files;
        const uploaderName = document.getElementById("uploader").value.trim();
        const guestMessage = document.getElementById("message").value.trim();

        if (!uploaderName) {
            uploader.focus();
            uploader.style.borderColor = "#d66";
            showToast("Please enter your name", "error");
            return;
        }

        uploader.style.borderColor = "";

        if (!files.length) {
            showToast("Please select at least one photo", "error");
            return;
        }

        showToast("Uploading memories...", "info");

        for (let file of files) {
            await uploadSingle(file, uploaderName, guestMessage);
        }

        showToast("Upload successful 💚 Thank you for sharing!", "success");

        resetAfterUpload();

    } catch (err) {
        console.error("Upload failed:", err);
        showToast("Upload failed ❌ Please try again", "error");
    } finally {
        uploadBtn.disabled = false;
    }
}

/* =========================
   SINGLE FILE UPLOAD
========================= */
function uploadSingle(file, uploaderName, guestMessage) {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {

            const base64Data = reader.result.split(",")[1];

            const formData = new FormData();
            formData.append("file", base64Data);
            formData.append("filename", file.name);
            formData.append("mimeType", file.type);
            formData.append("uploader", uploaderName);
            formData.append("message", guestMessage);

            fetch(scriptURL, {
                method: "POST",
                body: formData
            })
                .then(res => {
                    if (!res.ok) throw new Error("HTTP error " + res.status);
                    return res.text();
                })
                .then(resolve)
                .catch(reject);
        };

        reader.readAsDataURL(file);

    });
}

/* =========================
   RESET AFTER UPLOAD
========================= */
function resetAfterUpload() {
    input.value = "";
    preview.innerHTML = "";
    uploader.value = "";
    message.value = "";

    previewAllBtn.style.display = "none";
    allFiles = [];
    isExpanded = false;
}

