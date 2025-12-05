function re(e) {
  try {
    const t = localStorage.getItem("savedChallenges");
    if (t) {
      const a = JSON.parse(t).find((o) => String(o.id) === String(e));
      return a && a.title || "Room";
    }
  } catch {
  }
  return "Room";
}
function se(e) {
  try {
    const t = localStorage.getItem("savedChallenges");
    if (t)
      return JSON.parse(t).find((o) => String(o.id) === String(e)) || null;
  } catch {
  }
  return null;
}
function ce(e) {
  if (document.getElementById("booking-modal-overlay"))
    return;
  const t = document.createElement("div");
  t.id = "booking-modal-overlay", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.className = "booking-overlay";
  const n = document.createElement("div");
  n.id = "booking-modal", n.className = "booking-modal";
  const a = document.createElement("h3"), o = re(e);
  a.innerText = `Book room “${o}” (step 1)`;
  const u = document.createElement("div");
  u.id = "booking-steps";
  const i = document.createElement("div");
  i.id = "booking-step-1";
  const f = document.createElement("p");
  f.className = "booking-intro", f.innerText = "What date would you like to come?";
  const p = document.createElement("label");
  p.htmlFor = "booking-date", p.innerText = "Date";
  const h = document.createElement("input");
  h.type = "date", h.id = "booking-date", h.name = "booking-date";
  const l = document.createElement("button");
  l.innerText = "Search available times", l.className = "card__button", l.type = "button", i.appendChild(f), i.appendChild(p), i.appendChild(h);
  const g = document.createElement("div");
  g.id = "booking-step-2", g.classList.add("is-hidden");
  const s = document.createElement("div");
  s.id = "booking-status", s.className = "booking-status", l.addEventListener("click", async () => {
    const c = h.value;
    if (!c) {
      s.innerText = "Please choose a date first.";
      return;
    }
    s.innerText = "Looking for available times...";
    try {
      const T = await le(c, e);
      de(g, T, c, e, t, () => {
        const b = document.getElementById("booking-modal");
        b && ue(b, t);
      }), i.classList.add("is-hidden"), g.classList.remove("is-hidden"), a.innerText = `Book room “${o}” (step 2)`, s.innerText = "", r.innerHTML = "";
    } catch (T) {
      s.innerText = "Could not load available times.", console.error(T);
    }
  }), t.addEventListener("click", (c) => {
    c.target === t && U(t);
  });
  const d = (c) => {
    c.key === "Escape" && U(t);
  };
  document.addEventListener("keydown", d), n.appendChild(a), n.appendChild(u), u.appendChild(i), u.appendChild(g), n.appendChild(s);
  const r = document.createElement("div");
  r.className = "booking-actions booking-actions--end", r.appendChild(l), n.appendChild(r), t.appendChild(n), document.body.appendChild(t), setTimeout(() => h.focus(), 50), t._escHandler = d;
}
function U(e) {
  if (!e)
    return;
  const t = e._escHandler;
  t && document.removeEventListener("keydown", t), e.remove();
}
async function le(e, t) {
  const n = `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${encodeURIComponent(e)}&challenge=${encodeURIComponent(t)}`, a = await fetch(n);
  if (!a.ok)
    throw new Error(`Status ${a.status}`);
  const o = await a.json();
  return Array.isArray(o.slots) ? o.slots : [];
}
function de(e, t, n, a, o, u) {
  e.innerHTML = "";
  const i = document.createElement("form");
  i.id = "booking-form", i.className = "booking-form";
  const f = document.createElement("label");
  f.htmlFor = "booking-name", f.innerText = "Name";
  const p = document.createElement("input");
  p.id = "booking-name", p.name = "name", p.type = "text", p.required = !0;
  const h = document.createElement("label");
  h.htmlFor = "booking-email", h.innerText = "E-mail";
  const l = document.createElement("input");
  l.id = "booking-email", l.name = "email", l.type = "email", l.required = !0;
  const g = document.createElement("label");
  g.htmlFor = "booking-time", g.innerText = "What time?";
  const s = document.createElement("select");
  if (s.id = "booking-time", s.name = "time", !t || t.length === 0) {
    const m = document.createElement("option");
    m.disabled = !0, m.selected = !0, m.innerText = "No available times", s.appendChild(m), s.disabled = !0;
  } else
    t.forEach((m, k) => {
      const x = document.createElement("option");
      x.value = m, x.innerText = m, k === 0 && (x.selected = !0), s.appendChild(x);
    });
  const d = document.createElement("label");
  d.htmlFor = "booking-participants", d.innerText = "How many participants?";
  const r = document.createElement("select");
  r.id = "booking-participants", r.name = "participants";
  let c = 1, T = 20;
  const b = se(a);
  b && typeof b.minParticipants == "number" && (c = Math.max(1, b.minParticipants)), b && typeof b.maxParticipants == "number" && (T = Math.max(c, b.maxParticipants));
  for (let m = c; m <= T; m++) {
    const k = document.createElement("option");
    k.value = String(m), k.innerText = `${m} participant${m > 1 ? "s" : ""}`, m === c && (k.selected = !0), r.appendChild(k);
  }
  const D = document.createElement("div");
  D.className = "booking-actions booking-actions--end";
  const S = document.createElement("button");
  S.type = "submit", S.className = "card__button", S.innerText = "Submit booking", D.appendChild(S);
  const A = document.createElement("div");
  A.id = "booking-submit-status", A.className = "booking-submit-status", i.appendChild(f), i.appendChild(p), i.appendChild(h), i.appendChild(l), i.appendChild(g), i.appendChild(s), i.appendChild(d), i.appendChild(r), i.appendChild(D), i.appendChild(A), i.addEventListener("submit", async (m) => {
    m.preventDefault(), S.disabled = !0, A.innerText = "Submitting booking...";
    try {
      const k = await fetch("https://lernia-sjj-assignments.vercel.app/api/booking/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge: Number(a),
          name: p.value,
          email: l.value,
          date: n,
          time: s.value,
          participants: Number(r.value)
        })
      });
      if (!k.ok)
        throw new Error(`Booking failed: ${k.status}`);
      const x = await k.json();
      console.log("Booking response:", x), A.innerText = "Booking confirmed.", typeof u == "function" && u({
        challengeId: a,
        date: n,
        time: s.value,
        name: p.value,
        email: l.value,
        participants: r.value
      });
    } catch (k) {
      console.error(k), A.innerText = "Failed to submit booking.", S.disabled = !1;
    }
  }), e.appendChild(i);
}
function ue(e, t) {
  e.innerHTML = "";
  const n = document.createElement("div");
  n.className = "booking-thanks";
  const a = document.createElement("h3");
  a.innerText = "Thank you!";
  const o = document.createElement("a");
  o.href = "./challenges.html", o.innerText = "Back to challenges", o.className = "booking-thanks__back", n.appendChild(a), n.appendChild(o), e.appendChild(n);
}
let M = new Array(3).fill({});
async function me() {
  try {
    const t = await fetch("https://lernia-sjj-assignments.vercel.app/api/challenges");
    if (!t.ok)
      throw new Error(`Response status: ${t.status}`);
    const a = (await t.json()).challenges;
    return localStorage.clear(), localStorage.setItem("savedChallenges", JSON.stringify(a)), localStorage.setItem("lastFetch", JSON.stringify(Date.now())), a;
  } catch (e) {
    console.error(e.message);
  }
}
const ee = () => {
  let e = localStorage.getItem("lastFetch"), t = 0;
  return e && (t = +e), Date.now() - t < 3e4;
};
function $() {
  let e = [];
  if (localStorage.getItem("savedChallenges") && ee()) {
    const t = localStorage.getItem("savedChallenges");
    t ? e = JSON.parse(t) : console.error("Problem has arised with challenges saved in localStorage.");
  } else
    e = me();
  return e;
}
function pe(e) {
  let t = [];
  if (localStorage.getItem("savedTopThree") && ee()) {
    const n = localStorage.getItem("savedTopThree");
    if (n)
      M = JSON.parse(n);
    else
      throw new Error("Problem has arised with top three list saved in localStorage");
  } else
    t = [...e].sort((a, o) => o.rating - a.rating).slice(0, 3), M = t, localStorage.setItem("savedTopThree", JSON.stringify(t));
  return M;
}
function he(e) {
  let t = /* @__PURE__ */ new Set();
  return e.forEach((n) => {
    n.labels.forEach((a) => {
      t.add(a);
    });
  }), t;
}
const J = (e, t) => {
  e.forEach((n) => {
    const a = document.createElement("img");
    a.setAttribute("src", n.image), a.setAttribute("class", "card__image");
    const o = document.createElement("img");
    o.setAttribute("src", n.type === "online" ? "resources/online.png" : n.type === "onsite" ? "resources/onsite.png" : ""), o.setAttribute("alt", n.type), o.setAttribute("class", "card__type");
    const u = document.createElement("h4");
    u.setAttribute("class", "card__title"), u.innerText = n.title;
    const i = document.createElement("div"), f = document.createElement("span"), p = n.rating, h = Math.ceil(n.rating);
    for (let r = 1; r <= h; r++) {
      const c = document.createElement("img");
      0 < r - p && r - p < 1 ? (c.setAttribute("src", "resources/Star 3 half.svg"), c.setAttribute("class", "rating__star--half"), f.appendChild(c)) : (c.setAttribute("src", "resources/Star 3.svg"), c.setAttribute("class", "rating__star"), f.appendChild(c));
    }
    if (5 - h > 0)
      for (let r = 0; r < 5 - h; r++) {
        const c = document.createElement("img");
        c.setAttribute("src", "resources/Star 3 hollow.svg"), c.setAttribute("class", "rating__star--empty"), f.appendChild(c);
      }
    i.appendChild(f), i.setAttribute("class", "rating-container");
    const l = document.createElement("span");
    l.innerText = n.minParticipants + " - " + n.maxParticipants + " participants", l.setAttribute("class", "card__room-participants"), i.appendChild(l);
    const g = document.createElement("div");
    g.setAttribute("class", "card__description"), g.innerText = n.description;
    const s = document.createElement("button");
    s.setAttribute("class", "card__button"), s.setAttribute("data-type", "booking"), s.setAttribute("data-id", "" + n.id), s.innerText = n.type === "online" ? "Take challenge online" : "Book this room", s.addEventListener("click", (r) => {
      w(r);
    }), s.addEventListener("keydown", (r) => {
      (r.key === "Enter" || r.key === " ") && (r.preventDefault(), w(r));
    });
    const d = document.createElement("article");
    d.setAttribute("id", "" + n.id), d.setAttribute("class", "card"), d.setAttribute("data-type", n.type), d.appendChild(a), d.appendChild(o), d.appendChild(u), d.appendChild(i), d.appendChild(g), d.appendChild(s), t.appendChild(d);
  });
};
function ge(e, t) {
  e.forEach((n) => {
    n = n[0]?.toUpperCase() + n.slice(1).toLowerCase();
    const a = document.createElement("button");
    a.setAttribute("class", "tag-pill"), a.innerText = n, t.appendChild(a);
  });
}
const te = document.querySelector(".header__logo"), ne = document.querySelector(".navigation"), fe = document.querySelectorAll("button"), V = document.querySelector(".card-container"), ae = document.querySelector(".footer");
te.addEventListener("click", () => {
  window.location.assign("./index.html");
});
te.addEventListener("keydown", (e) => {
  (e.key === "Enter" || e.key === " ") && (e.preventDefault(), window.location.assign("./index.html"));
});
ne.addEventListener("click", (e) => {
  w(e);
});
ne.addEventListener("keydown", (e) => {
  (e.key === "Enter" || e.key === " ") && (e.preventDefault(), w(e));
});
fe.forEach((e) => {
  e.addEventListener("click", (t) => {
    w(t);
  }), e.addEventListener("keydown", (t) => {
    (t.key === "Enter" || t.key === " ") && (t.preventDefault(), w(t));
  });
});
ae.addEventListener("click", (e) => {
  w(e);
});
ae.addEventListener("keydown", (e) => {
  (e.key === "Enter" || e.key === " ") && (e.preventDefault(), w(e));
});
function w(e) {
  e.preventDefault();
  const t = e.target;
  if (t.tagName === "A" || t.tagName === "BUTTON") {
    const n = t.dataset.type, a = t.dataset.id;
    switch (n) {
      case "online":
        window.location.assign("./challenges.html?type=online");
        break;
      case "on-site":
      case "onsite":
        window.location.assign("./challenges.html?type=onsite");
        break;
      case "see_all":
        window.location.assign("./challenges.html?type=none");
        break;
      case "story":
        window.location.assign("./storypage.html");
        break;
      case "contact":
        window.location.assign("./contact.html");
        break;
      case "legal":
        window.location.assign("./legal.html");
        break;
      case "filter":
        console.log("Filter is clicked! Should filter something!");
        break;
      case "booking":
        ce(a);
        break;
      default:
        console.log("Going nowhere!");
    }
  }
}
let ke = await $(), be = pe(ke);
V && J(be, V);
let O, oe = /* @__PURE__ */ new Set();
const ye = window.location.search, ve = new URLSearchParams(ye), W = ve.get("type"), z = document.querySelector(".cards-grid"), G = document.querySelector(".tag-list");
O = await $();
oe = he(O);
if (z) {
  let e;
  W !== "none" ? e = O.filter((t) => t.type === W) : e = O, J(e, z);
} else
  console.error("DOM Pointer for card container not connected!");
G ? ge(oe, G) : console.error("DOM Pointer for tags container not connected!");
const q = document.querySelector("#filterToggle"), I = document.querySelector("#filters"), Y = document.querySelector(".filter-header__close");
q && I && Y && (q.addEventListener("click", () => {
  I.hidden = !1, q.hidden = !0;
}), Y.addEventListener("click", () => {
  I.hidden = !0, q.hidden = !1;
}), document.addEventListener("keydown", (e) => {
  e.key === "Escape" && !I.hidden && (I.hidden = !0, q.hidden = !1);
}));
const _ = document.querySelector(".cards-grid"), K = new URLSearchParams(window.location.search), Q = K.get("type") || K.get("filter"), B = Q === "on-site" ? "onsite" : Q;
let X = [], ie = [];
const y = document.querySelector("#f-online"), v = document.querySelector("#f-onsite"), Ee = document.querySelectorAll("#filters .filter-checkbox"), R = document.querySelectorAll(".rating-widget"), Z = document.querySelectorAll(".tag-pill"), F = document.querySelector("#f-query"), Ce = document.querySelector("#filterReset"), H = y?.closest(".filter-checkbox"), j = v?.closest(".filter-checkbox");
let N = /* @__PURE__ */ new Set(), E = 0, C = 5;
Ee.forEach((e) => {
  const t = e.querySelector(".filter-checkbox__input");
  t && (e.classList.toggle("is-checked", t.checked), e.addEventListener("click", (n) => {
    n.preventDefault(), t.checked = !t.checked, e.classList.toggle("is-checked", t.checked), t.dispatchEvent(new Event("change", { bubbles: !0 }));
  }));
});
async function we() {
  try {
    const e = await $();
    X = Array.isArray(e) ? e : [], ie = [...X], y.checked = !0, v.checked = !0, B && B !== "none" && (B === "online" ? (y.checked = !0, v.checked = !1) : B === "onsite" && (y.checked = !1, v.checked = !0)), H?.classList.toggle("is-checked", y.checked), j?.classList.toggle("is-checked", v.checked), R.forEach((t) => {
      const a = t.dataset.role === "min" ? E : C;
      P(t, a);
    }), Le(), L();
  } catch {
    _.innerHTML = "<p>Could not load challenges</p>";
  }
}
function Le() {
  y?.addEventListener("change", () => {
    H?.classList.toggle("is-checked", y.checked), L();
  }), v?.addEventListener("change", () => {
    j?.classList.toggle("is-checked", v.checked), L();
  }), R.forEach((e) => {
    e.addEventListener("click", (n) => {
      const a = n.target;
      if (!a.classList.contains("star")) return;
      const o = Number(a.dataset.value), u = e.dataset.role;
      u === "min" ? (E = E === o ? 0 : o, P(e, E)) : u === "max" && (C = C === o ? 5 : o, P(e, C)), L();
    });
    const t = e.querySelectorAll(".star");
    t.forEach((n) => {
      n.addEventListener("mouseenter", () => {
        const a = Number(n.dataset.value);
        t.forEach((o) => {
          const u = Number(o.dataset.value);
          o.classList.toggle("is-active", u <= a);
        });
      }), n.addEventListener("mouseleave", () => {
        const o = e.dataset.role === "min" ? E : C;
        P(e, o);
      });
    });
  }), Z.forEach((e) => {
    e.addEventListener("click", () => {
      const t = e.textContent.trim().toLowerCase();
      N.has(t) ? (N.delete(t), e.classList.remove("is-active")) : (N.add(t), e.classList.add("is-active")), L();
    });
  }), F?.addEventListener("input", L), Ce?.addEventListener("click", () => {
    y.checked = !0, v.checked = !0, H?.classList.add("is-checked"), j?.classList.add("is-checked"), E = 0, C = 5, R.forEach((e) => {
      P(e, e.dataset.role === "min" ? E : C);
    }), N.clear(), Z.forEach((e) => e.classList.remove("is-active")), F && (F.value = ""), L();
  });
}
function Te(e) {
  const t = y.checked, n = v.checked;
  return !t && !n ? [] : e.filter(
    (a) => t && a.type === "online" || n && (a.type === "onsite" || a.type === "on-site")
  );
}
function P(e, t) {
  e.querySelectorAll(".star").forEach((n) => {
    const a = Number(n.dataset.value);
    n.classList.toggle("is-active", a <= t);
  });
}
function Se(e) {
  return e.filter((t) => t.rating >= E && t.rating <= C);
}
function Ae(e) {
  return N.size === 0 ? e : e.filter((t) => {
    if (!Array.isArray(t.labels)) return !1;
    const n = t.labels.map((a) => String(a).toLowerCase());
    return [...N].every((a) => n.includes(a));
  });
}
function xe(e) {
  const t = F.value.toLowerCase().trim();
  return t ? e.filter(
    (n) => n.title.toLowerCase().includes(t) || n.description.toLowerCase().includes(t)
  ) : e;
}
function L() {
  let e = [...ie];
  if (e = Te(e), e = Se(e), e = Ae(e), e = xe(e), !e.length) {
    _.removeAttribute("class"), _.innerHTML = '<p class="no-matches">No matching challenges</p>';
    return;
  }
  _.innerHTML = "", _.setAttribute("class", "cards-grid"), J(e, _);
}
we();
console.log("All kod är importerad och redo!");
