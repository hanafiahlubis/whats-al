document.querySelector(".logout").addEventListener("click", async () => {
    const res = await fetch("/api/logout");
    const messege = await res.text();
    alert(messege);
    location.href = "/";
});

function openNav() {
    const sidepanel = document.getElementById("my-sidepanel"); // Simpan elemen sidepanel ke dalam variabel

    if (sidepanel) { // Cek apakah elemen sidepanel ada di dalam DOM
        if (window.innerWidth <= 420) { // Cek lebar window
            sidepanel.style.width = "113px"; // Set lebar sidepanel menjadi 113px jika lebar window kurang dari 420px
        } else if (window.innerWidth <= 666) {
            sidepanel.style.width = "156px"; // Set lebar sidepanel menjadi 113px jika lebar window kurang dari 420px
        }
        else {
            sidepanel.style.width = "238px"; // Set lebar sidepanel menjadi 238px jika lebar window 420px atau lebih
        }
    }
}

document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("my-sidepanel").style.width = "0";
});

const searchInput = document.querySelector("#serch>input");
const list = document.querySelector(".teman");
let pengguna;
let intervalId;
const kontak = document.querySelector("#right-countain");
const awal = document.querySelector(".awal");
const img = document.querySelector(".header>img");
let dataTerakhir = [];

fetch("/api/me")
    .then((res) => res.json())
    .then((user) => {
        pengguna = user;
        img.src = `/photos/${user.photo}`;
    });

const teman = document.querySelector(".teman");

img.addEventListener("click", () => (location.href = "profil"));

const dataTeman = [];

async function tampilkanTeman() {
    const res = await fetch("/api/teman");
    const data = await res.json();

    data.forEach((e, i) => {
        dataTeman[i] = e;
        const a = document.createElement("a");

        const divImg = document.createElement("div");
        const img = document.createElement("img");

        img.src = `/photos/${e.photo}`;
        img.alt = "Img Tidak ada";
        divImg.appendChild(img);

        const div = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = e.nama_lengkap;
        div.appendChild(h3);
        a.appendChild(divImg);
        a.appendChild(div);
        a.value = e.id;
        a.className = `pesan-teman`;

        teman.appendChild(a);
    });

    const buttons = document.querySelectorAll(".pesan-teman");

    buttons.forEach((e, i) => {
        e.onclick = async () => {
            awal.innerHTML = "";
            clearInterval(intervalId);
            membuatBio(i);
            pesan(e, i);
        };
    });

    searchInput.addEventListener("input", () => {
        const inputValue = searchInput.value.toLowerCase();
        const allConteck = list.querySelectorAll("a");
        allConteck.forEach((e, _i) => {
            const listItemText = e.textContent.toLowerCase();

            if (listItemText.indexOf(inputValue) !== -1) {
                e.style.display = "flex";
            } else {
                e.style.display = "none";
            }
        });
    });
}

function membuatBio(index) {
    kontak.innerHTML = "";

    const div = document.createElement("div");
    const div2 = document.createElement("div");
    const h2 = document.createElement("h2");
    const img = document.createElement("img");

    img.src = `/photos/${dataTeman[index].photo}`;
    h2.textContent = dataTeman[index].username;

    div2.appendChild(h2);
    div.appendChild(img);
    div.appendChild(div2);

    div.className = "herder-kontak";
    kontak.appendChild(div);
}

async function pesan(e, index) {
    const res = await fetch(`/api/pesan/${e.value}`);
    const data = await res.json();

    const divUtama = document.createElement("div");
    divUtama.className = "container-pesan";

    data.forEach((e) => {
        const div = document.createElement("div");
        const divPesan = document.createElement("div");
        const h3 = document.createElement("h3");
        const p = document.createElement("p");
        const span = document.createElement("span");
        const tgl = e.tanggal_waktu.split("T");
        span.textContent = "delete";
        span.value = e.id;
        span.className = "material-symbols-outlined";
        h3.textContent = e.pesan;
        p.textContent = tgl[0];

        divPesan.appendChild(h3);
        div.appendChild(span);

        div.appendChild(divPesan);
        div.appendChild(p);
        divUtama.appendChild(div);

        if (e.id_pengirim === pengguna.id) {
            div.className = "user";
        } else {
            div.className = "penerima";
            if (!e.baca) {
                fetch(`/api/baca/${e.id}`, { method: "PUT" });
            }
        }
    });

    kontak.appendChild(divUtama);
    tompolKirim(e, divUtama);

    const delete2 = document.querySelectorAll(".material-symbols-outlined");

    delete2.forEach((b) => {
        b.addEventListener("click", async () => {
            console.log(b.value);
            const boll = confirm("Apakah Kamu akan menghapus pesan ini");
            if (boll) {
                await fetch(`/api/pesan/${b.value}`, {
                    method: "DELETE",
                });
                b.parentElement.remove();
            }
        });
    });

    divUtama.scrollTo(0, divUtama.scrollHeight);

    if (e.value !== pengguna.id) {
        intervalId = setInterval(async () => {
            const res = await fetch(`/api/pesan-baru/${e.value}`);
            const data = await res.json();

            data.forEach(async (pesan, _i) => {
                const div = document.createElement("div");
                const divPesan = document.createElement("div");
                const h3 = document.createElement("h3");
                const p = document.createElement("p");
                const span = document.createElement("span");
                span.textContent = "delete";
                span.value = pesan.id;
                span.className = "material-symbols-outlined";
                h3.textContent = pesan.pesan;

                divPesan.appendChild(h3);

                div.appendChild(span);
                div.appendChild(divPesan);

                const tgl = pesan.tanggal_waktu.split("T");
                p.textContent = tgl[0];
                dataTerakhir[0] = pesan;

                setTimeout(() => {
                    div.appendChild(p);
                }, 1000);
                if (pesan.id_pengirim === pengguna.id) {
                    div.className = "user";
                    if (pengguna.id === pesan.id_penerima && !pesan.baca) {
                        fetch(`/api/baca/${pesan.id}`, { method: "PUT" });
                    }
                } else {
                    div.className = "penerima";
                    img.src = `/photos/${dataTeman[index].photo}`;
                    img.alt = `dsadsadasda`;
                    if (!pesan.baca) {
                        fetch(`/api/baca/${pesan.id}`, { method: "PUT" });
                    }
                }

                divUtama.appendChild(div);
                div.appendChild(divPesan);
                divUtama.appendChild(div);
                divUtama.scrollTo(0, divUtama.scrollHeight);
            });
        }, 1000);
    }
}

async function tompolKirim(tombol, _divUtama) {
    const form = document.createElement("form");
    form.name = "kirim";
    form.className = "pengiriman";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.name = "pesan";
    input.required = true;
    input.placeholder = "Kirim Pesan";
    input.className = "text-pesan";
    const button = document.createElement("button");
    button.textContent = "Kirim";

    form.onsubmit = async (i) => {
        i.preventDefault();
        input.disabled = true;
        const divUtama = document.querySelector(".container-pesan");
        const div = document.createElement("div");
        const divPesan = document.createElement("div");
        const h3 = document.createElement("h3");
        const p = document.createElement("p");

        const span = document.createElement("span");
        span.textContent = "delete";
        span.className = "material-symbols-outlined";

        h3.textContent = document.kirim.pesan.value;
        div.className = "user";

        divPesan.appendChild(h3);
        div.appendChild(span);
        div.appendChild(divPesan);

        divUtama.appendChild(div);

        await fetch(`/api/tambah/pesan/${tombol.value}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pesan: document.kirim.pesan.value,
            }),
        });
        const res = await fetch(`/api/pesan-sekarang/${tombol.value}`);
        const data = await res.json();

        span.value = data.id;
        p.textContent = data.tanggal_waktu.split("T")[0];

        div.appendChild(p);
        divUtama.scrollTo(0, divUtama.scrollHeight);
        input.value = "";
        input.disabled = false;
    };
    form.appendChild(input);
    form.appendChild(button);
    kontak.appendChild(form);
}

tampilkanTeman();
