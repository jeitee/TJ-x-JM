
const input = document.getElementById("images");
const preview = document.getElementById("preview");
const uploadBtn = document.getElementById("uploadBtn");
const uploader = document.getElementById("uploader");
const previewAllBtn = document.getElementById("previewAllBtn");

const SUPABASE_URL = "https://jwixdwokeguliuwbwbqs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3GnDVyYMSG5eqX3d1KPw1w_BbOvLHxA";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const message = document.getElementById("message");

const EVENT_ID = "teejei-judith";
const BUCKET_NAME = "wedding-photos";

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
// const scriptURL = "https://script.google.com/macros/s/AKfycbwhvpQXMZn_4rAXxON983iPB6_yXdz6nj6nYpz1obB3o-e661ytQw48Y5RjGChqtblfWQ/exec";

/* =========================
   ATTACH REAL UPLOAD
========================= */
uploadBtn.onclick = uploadFiles;

/* =========================
   UPLOAD CONTROLLER
========================= */
async function uploadFiles() {

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    const files = Array.from(input.files);

    const uploaderName = uploader.value.trim();
    const guestMessage = message.value.trim();

    if (!uploaderName) {

        uploader.focus();
        uploader.style.borderColor = "#d66";

        showToast("Please enter your name", "error");

        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Memories";

        return;
    }

    if (!files.length) {

        showToast("Please select at least one photo", "error");

        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Memories";

        return;
    }

    uploader.style.borderColor = "";

    showToast("Uploading memories...", "info");

    try {

        // Upload all files
        await Promise.all(
            files.map(file =>
                uploadSingle(file, uploaderName)
            )
        );

        // Save guest message
        await saveGuestMessage(
            uploaderName,
            guestMessage,
            files.length
        );

        showToast(
            "Upload successful 💚 Thank you for sharing!",
            "success"
        );

        resetAfterUpload();

    } catch (err) {

        console.error("Upload Error:", err);

        showToast(
            err.message || "Upload failed ❌ Please try again",
            "error"
        );

    } finally {

        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Memories";
    }
}

/* =========================
   SINGLE FILE UPLOAD
========================= */
async function uploadSingle(file, uploaderName) {

    const safeUploader = uploaderName
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim();

    const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    const filePath =
        `${EVENT_ID}/${safeUploader}/${uniqueName}`;

    const { error } = await sb.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false
        });

    if (error) {
        throw error;
    }

    return true;
}

/* =========================
   SAVE GUEST MESSAGE
========================= */
async function saveGuestMessage(
    uploaderName,
    guestMessage,
    fileCount
) {

    const { error } = await sb
        .from("memories")
        .insert({
            uploader: uploaderName,
            message: guestMessage,
            photo_count: fileCount
        });

    if (error) {
        throw error;
    }

    return true;
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

