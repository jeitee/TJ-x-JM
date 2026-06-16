const scriptURL = "https://script.google.com/macros/s/AKfycbxXQJFBmRsf-mP3SvybdbbuU_GFyjJ8oTihE63v-9iPa33Imv6_1R6dhzi9PQWgu0p2/exec";

async function uploadFiles() {
  const input = document.getElementById("images");
  const files = input.files;

  if (!files.length) {
    alert("No files selected");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    await uploadSingle(files[i]);
  }

  alert("Upload complete!");
}

function uploadSingle(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("filename", file.name);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log("Uploaded:", data.url);
      resolve(data);
    })
    .catch(err => {
      console.error(err);
      reject(err);
    });
  });
}