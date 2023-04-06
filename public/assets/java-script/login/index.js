document.kirim.onsubmit = (e) => {
    e.preventDefault();
    const username = document.kirim.username.value;
    const password = document.kirim.password.value;

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then(async (response) => {
        if (response.ok) {
            location.href = "/";
        } else {
            const message = await response.text();
            alert(message);
        }
    });
};

document
    .querySelector(".sing-up")
    .addEventListener("click", () => (location.href = "./daftar-login/"));

document
    .querySelector(".forgot")
    .addEventListener("click", () => (location.href = "./lupa-password/"));