let pengguna;

const searchInput = document.querySelector("#serch>input");

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

const add = document.querySelector(".container-cerita");
const kontak = document.querySelector("#right-countain");
const awal = document.querySelector(".awal");
const img = document.querySelector(".header>img");
const container = document.querySelector(".container2");

document.querySelector(".logout").addEventListener("click", async () => {
    const res = await fetch("/api/logout");
    const messege = await res.text();
    alert(messege);
    location.href = "/";
});

fetch("/api/me")
    .then((res) => res.json())
    .then((user) => {
        pengguna = user;
        img.src = `/photos/${user.photo}`;
    });

function openNav() {
    document.getElementById("my-sidepanel").style.width = "238px";
}
// untuk menutup menu
document.querySelector(".close-btn-add").addEventListener("click", () => {
    document.getElementById("my-sidepanel").style.width = "0";
});

// untuk menutup post cerita
document.querySelector(".close-btn").addEventListener("click", () => {
    add.style.display = "none";
    document.querySelector("#icon-tambah").style.display = "inline";
    container.style.display = "grid";
});

const teman = document.querySelector(".teman");
let dataTeman = [];

// untuk membuka profil
img.addEventListener("click", () => (location.href = "profil"));

document.querySelector("#icon-tambah").addEventListener("click", () => {
    document.querySelector("#icon-tambah").style.display = "none";
    if (document.querySelectorAll(".herder-kontak").length > 0) {
        document.querySelector(".herder-kontak").style.display = "none";
        document.querySelector(".tampil-cerita").style.display = "none";
    }
    container.style.display = "none";
    add.style.display = "flex";
});

const list = document.querySelector(".teman");

async function tampilkanTeman() {
    const res = await fetch("/api/teman");
    const data = await res.json();

    data.forEach((e, i) => {
        dataTeman[i] = e;
        console.log(e);
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
        a.className = `cerita-orang`;

        teman.appendChild(a);
    });

    const buttons = document.querySelectorAll(".cerita-orang");

    buttons.forEach((e, i) => {
        console.log(e);

        e.onclick = async () => {
            container.innerHTML = "";
            const div = document.createElement("div");
            div.className = "tampil-cerita";
            container.appendChild(div);
            add.style.display = "none";
            container.style.display = "grid";
            document.querySelector("#icon-tambah").style.display = "flex";
            membuatBio(i);
            cerita(e);
        };

        e.addEventListener("dblclick", () => console.log("ok"));
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

//tambah cerita
document.kirim.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", document.kirim.file.files[0]);
    data.append("caption", document.kirim.caption.value);
    await fetch("/api/story", {
        method: "POST",
        body: data,
    });

    document.kirim.file.value = "";
    document.kirim.caption.value = "";
    add.style.display = "none";
    document.querySelector(".container-cerita").style.display = "none";
    document.querySelector("#icon-tambah").style.display = "flex";
};

function membuatBio(index) {
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
    container.appendChild(div);
}

async function cerita(e) {
    const div = document.querySelector(".tampil-cerita");
    const div2 = document.createElement("div");
    const res = await fetch(`/api/story/${e.value}`);
    const data = await res.json();
    data.forEach((e) => {
        file = e.media.split(".");
        const divMedia = document.createElement("div");
        if (file[1] === "img") {
            const img = document.createElement("img");
            const caption = document.createElement("p"); //belum

            img.src = `/photos/${file[0]}`;
            caption.textContent = e.caption;
            caption.className = "caption-img";
            divMedia.className = "div-img box";

            if (pengguna.id === e) {
            }

            divMedia.appendChild(img);
            divMedia.appendChild(caption);
            div.appendChild(divMedia);
        } else if (file[1] === "mp4") {
            const vidio = document.createElement("video");
            const caption = document.createElement("p");
            vidio.controls = true;
            vidio.autoplay = true;
            vidio.loop = true;

            vidio.src = `/photos/${file[0]}`;
            const source = document.createElement("source");
            source.type = "vidio/webm";
            source.src = `/photos/${file[0]}`;

            const source2 = document.createElement("source");
            source2.type = "vidio/mp4";
            source2.src = `/photos/${file[0]}`;
            caption.textContent = e.caption;
            divMedia.className = "div-video box";

            vidio.appendChild(source);
            vidio.appendChild(source2);
            divMedia.appendChild(vidio);
            divMedia.appendChild(caption);
            div.appendChild(divMedia);
        } else {
            alert("ok");
        }
    });
}

async function tompolKirim(id, divUtama) {
    const form = document.createElement("form");
    form.name = "kirim";
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.name = "pesan";
    const button = document.createElement("button");
    button.textContent = "Kirim";
    form.onsubmit = async (i) => {
        i.preventDefault();
        input.disabled = true;
        const divUtama = document.querySelector(".container-pesan");
        const div = document.createElement("div");
        const divPesan = document.createElement("div");
        const h3 = document.createElement("h3");

        h3.textContent = document.kirim.pesan.value;
        div.className = "user";

        divPesan.appendChild(h3);
        div.appendChild(divPesan);
        divUtama.appendChild(div);
        await fetch(`/api/tambah/pesan/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pesan: document.kirim.pesan.value,
            }),
        });
        divUtama.scrollTo(0, divUtama.scrollHeight);
        input.value = "";
        input.disabled = false;
    };
    form.appendChild(input);
    form.appendChild(button);
    kontak.appendChild(form);
}

tampilkanTeman();