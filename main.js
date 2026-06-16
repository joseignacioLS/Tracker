
let data = JSON.parse(localStorage.getItem("it_data")) || [];
let activeId = localStorage.getItem("it_active") || null;

/* SAVE */
function save() {
    localStorage.setItem("it_data", JSON.stringify(data));
    localStorage.setItem("it_active", activeId);
    localStorage.setItem("it_round", document.getElementById("round").value);
}

/* SORT */
function sorted() {
    return [...data].sort((a, b) => b.init - a.init);
}

/* RENDER */
function render() {

    document.getElementById("round").value =
        localStorage.getItem("it_round") || 1;

    const body = document.getElementById("body");
    body.innerHTML = "";

    let list = sorted();

    for (let c of list) {

        let isDead = c.hp <= 0;

        body.innerHTML += `
<tr class="${c.type} ${c.id === activeId ? 'active' : ''} ${isDead ? 'dead' : ''}">
<td>
<input class="edit"
value="${c.name}"
onchange="edit('${c.id}','name',this.value)">
</td>

<td class="info">

<div class="leftInfo">

🛡 <input class="edit" style="width:40px"
value="${c.ac}"
onchange="edit('${c.id}','ac',this.value)">

❤️ <input class="edit" style="width:40px"
value="${c.hp}"
onchange="edit('${c.id}','hp',this.value)">

/ <input class="edit" style="width:40px"
value="${c.maxhp}"
onchange="edit('${c.id}','maxhp',this.value)">

${isDead ? "☠" : ""}

<div class="hpControls">

<button class="hpBtn hpMinus"
onclick="damage('${c.id}',-1)">-1</button>

<button class="hpBtn hpPlus"
onclick="damage('${c.id}',1)">+1</button>

</div>

<div class="hpbar">
<div class="hpfill"
style="width:${(c.hp / c.maxhp) * 100}%"></div>
</div>

<!-- CONDICIONES -->
<div class="condBox">

${(c.conditions || []).map((cond, idx) => `
    <span class="condTag"
    onclick="removeCond('${c.id}',${idx})">
        ${cond} ✖
    </span>
`).join("")}

<button class="condAddBtn"
onclick="addCond('${c.id}')">+ estado</button>

</div>

</div>

<div class="rightInfo">

🪽 <input class="edit"
style="width:50px;text-align:right"
value="${c.init}"
onchange="edit('${c.id}','init',this.value)">

</div>

<button class="deleteBtn" onclick="del('${c.id}')">❌</button>

</td>
</tr>`;
    }

    save();
}

/* DAMAGE (PERMITE VIDA NEGATIVA) */
function damage(id, val) {
    let c = data.find(x => x.id === id);
    if (!c) return;

    c.hp += val;

    render();
}

/* CONDICIONES */
function addCond(id) {
    let c = data.find(x => x.id === id);
    if (!c) return;

    let cond = prompt("Condición en español:");
    if (!cond) return;

    if (!c.conditions) c.conditions = [];

    c.conditions.push(cond);

    render();
}

function removeCond(id, index) {
    let c = data.find(x => x.id === id);
    if (!c || !c.conditions) return;

    c.conditions.splice(index, 1);

    render();
}

/* ADD */
function add(type) {

    let name = prompt("Nombre:");
    if (!name) return;

    data.push({
        id: crypto.randomUUID(),
        type,
        name,
        init: +prompt("Iniciativa:", 0),
        ac: +prompt("CA:", 10),
        hp: +prompt("Vida:", 10),
        maxhp: +prompt("Max:", 10),
        conditions: []
    });

    render();
}

/* EDIT */
function edit(id, f, v) {
    let c = data.find(x => x.id === id);
    c[f] = f === "name" ? v : +v;
    render();
}

/* TURN */
function nextTurn() {

    let list = sorted();
    if (!list.length) return;

    let i = list.findIndex(x => x.id === activeId);
    i++;
    console.log({ i, l: list.length })
    if (i >= list.length) {
        i = 0;
        localStorage.setItem("it_round", Number(localStorage.getItem("it_round") || 1) + 1);
    }

    activeId = list[i].id;

    /* animación */
    setTimeout(() => {
        let row = document.querySelector("tr.active");
    }, 10);

    render();
}

/* DELETE */
function del(id) {
    if (!confirm("Eliminar?")) return;
    data = data.filter(x => x.id !== id);
    render();
}

/* RESET */
function resetAll() {
    if (!confirm("Borrar todo?")) return;
    if (!confirm("Última confirmación")) return;
    data = [];
    activeId = null;
    localStorage.clear();
    render();
}

/* KEYBOARD */
document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        e.preventDefault();
        nextTurn();
    }
});

window.addEventListener("load", () => {
    console.log("Load finished");
    render();
})