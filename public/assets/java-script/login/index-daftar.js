document.kirim.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", document.kirim.username.value);
    data.append("password", document.kirim.password.value);
    data.append("name", document.kirim.nama.value);
    data.append("file", document.kirim.file.files[0]);

    const response = await fetch("/api/akun", {
        method: "POST",
        body: data,
    });
    alert(await response.text());
    if (response.ok) location.href = "/login";
};

document
    .querySelector(".forgot")
    .addEventListener("click", () => (location.href = "../lupa-password/"));
document
    .querySelector(".login")
    .addEventListener("click", () => (location.href = "/login"));
