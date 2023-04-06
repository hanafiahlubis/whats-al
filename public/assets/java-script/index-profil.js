function pindah() {
    location.href = "/";
}
const img = document.querySelector(".header>img");
let pengguna = "";

function profil() {
    fetch("/api/me")
        .then((res) => res.json())
        .then((user) => {
            console.log(user);
            img.src = `/photos/${user.photo}`;
            document.bio.nama.value = user.nama_lengkap;
            document.bio.username.value = user.username;
            pengguna = user;
        });
}
profil();
document.bio.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (document.bio.file.files.length > 0) {
        data.append("file", document.bio.file.files[0]);
    }
    if (
        document.bio.file.files.length > 0 ||
        pengguna.nama_lengkap !== document.bio.nama.value ||
        document.bio.username.value !== pengguna.username
    ) {
        data.append("nama", document.bio.nama.value);
        data.append("username", document.bio.username.value);

        const res = await fetch("/api/bio", {
            method: "PUT",
            body: data,
        });
        const pesan = await res.text();
        alert(pesan);
        document.bio.file.value = "";
        profil();
    }
};