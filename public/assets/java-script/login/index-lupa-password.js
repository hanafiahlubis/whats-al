document.kirim.onclick = async (e) => {
    e.preventDefault();
    const username = document.kirim.username.value;
    const password = document.kirim.password.value;
    const res = await fetch("/api/edit-password/akun", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
    let data;
    if (res.ok) {
        data = await res.text();
        alert(data);
        location.href = "/login";
    } else {
        data = await res.text();
        console.log(data);
        alert(data);
        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";
    }
};

document
    .querySelector(".sing-up")
    .addEventListener("click", () => (location.href = "../daftar-login/"));

document
    .querySelector(".login")
    .addEventListener("click", () => (location.href = "/login"));