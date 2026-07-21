// Dialog clean-up & Backdrop styling
var dia = document.querySelectorAll("dialog");
if (dia.length) {
    dia.forEach(d => d.innerHTML = "");
}

var styleElem = document.head.appendChild(document.createElement("style"));
styleElem.innerHTML = "dialog::backdrop {background: #181a20} ::selection {background: #34ace1;color:white}";

// Loader Dialog setup
var loader = document.createElement("dialog");
document.body.appendChild(loader);
loader.innerHTML = `<div>PLEASE WAIT...</div>`;
loader.style = "border:none;outline:none;margin:auto;padding:1rem";

function showLoader() {
    loader.showModal();
    setTimeout(() => hideLoader(), 8000);
}
var hideLoader = () => loader.close();
showLoader();

// --- UID SYSTEM ---
let uid = localStorage.getItem("talha_script_uid");
if (!uid) {
    // Unique UID generator
    uid = "TALHA-" + self.crypto.getRandomValues(new BigUint64Array(1))[0].toString(16);
    localStorage.setItem("talha_script_uid", uid);
}

// Battery & Input UI Logic
var input = document.querySelector("input");
if (input) {
    document.querySelector(".battery2").style.width = `${Number(input.value) * 25 / 100}px`;

    input.onchange = () => {
        document.querySelector(".battery2").style.width = `${Number(input.value) * 25 / 100}px`;
        const max = parseInt(input.max);
        if (parseInt(input.value) > max) {
            input.value = max;
        }
    };
}

// --- FIREBASE REALTIME DATABASE VERIFICATION ---
const FIREBASE_URL = "https://talha-trader-admin-panel-lock-default-rtdb.firebaseio.com/users.json";

fetch(FIREBASE_URL)
    .then(res => res.json())
    .then(users => {
        hideLoader();

        // Check if user UID exists and is allowed in Firebase
        let currentUser = null;
        if (users) {
            // Matching directly by Key or checking inside user records
            if (users[uid]) {
                currentUser = users[uid];
            } else {
                // If stored as an array or object values
                Object.keys(users).forEach(key => {
                    if (users[key] && (users[key].uid === uid || key === uid)) {
                        currentUser = users[key];
                    }
                });
            }
        }

        // Access Granted Check
        if (currentUser && (currentUser.status === "active" || currentUser.status === true || currentUser.allowed === true)) {
            
            document.querySelector("#box").style.display = "block";

            // Dynamic Logo System from Firebase
            const userLogoUrl = currentUser.logo || currentUser.logoUrl || "";
            const logoElem = document.querySelector(".logo");
            
            if (logoElem) {
                if (userLogoUrl) {
                    logoElem.setAttribute("src", userLogoUrl);
                } else {
                    logoElem.setAttribute("src", "https://i.imgur.com/8N4Z2e1.png"); // Default fallback
                }
            }

            // Screenshot Capture System
            document.body.contentEditable = true;
            var btn = document.querySelector(".btn");
            if (btn) {
                btn.addEventListener("click", () => {
                    document.body.contentEditable = false;
                    html2canvas(document.querySelector("#box")).then(canvas => {
                        let a = document.createElement("a");
                        a.download = `SS-${Date.now()}.png`;
                        a.href = canvas.toDataURL("image/png");
                        a.click();
                    });
                });
            }

            // Set current time
            var time = new Date().toLocaleTimeString("en", { timeStyle: 'short' });
            if (document.querySelector(".mob_time")) {
                document.querySelector(".mob_time").innerHTML = time.replace(/\s|PM|AM/g, "");
            }

            // Chat Names & Layout Generators
            var chat_name_t = [137, 206, 277, 346, 416, 486, 555, 624];
            var sampleNames = ["Alex", "John", "David", "Sultan", "Trader Pro", "Crypto King", "VIP Member", "Signals", "Admin"];
            
            for (let i = 0; i < chat_name_t.length; i++) {
                let el = document.createElement('li');
                el.setAttribute("class", "chat_name");
                el.style.left = "73px";
                el.style.top = chat_name_t[i] + "px";
                el.innerHTML = sampleNames[i % sampleNames.length];
                if (document.querySelector(".ul_chat_name")) {
                    document.querySelector(".ul_chat_name").appendChild(el);
                }
            }

            // DP Positions & Online Bullets logic
            var chat_dp_t = [136, 207, 277, 346, 416, 486, 555, 625];
            var colors = ["#4794da", "#fa7e5b", "#f880a2", "#8ece5f", "#fdb456"];

            for (let i = 0; i < chat_dp_t.length; i++) {
                let el = document.createElement('li');
                el.setAttribute('class', 'chat_dp');
                el.style.top = chat_dp_t[i] + "px";
                el.style.left = "9px";
                
                let el2 = document.createElement('span');
                el2.setAttribute('class', "chat_named_dp");
                el2.style.background = colors[i % colors.length];
                el2.innerText = sampleNames[i][0];
                el.appendChild(el2);

                if (document.querySelector(".ul_chat_dp")) {
                    document.querySelector(".ul_chat_dp").appendChild(el);
                }
            }

            // Times list
            var chat_time_t = [140, 208, 279, 350, 420, 490, 559, 629];
            for (let i = 0; i < chat_time_t.length; i++) {
                let el = document.createElement('li');
                el.setAttribute("class", "chat_time");
                el.style.top = chat_time_t[i] + "px";
                el.innerText = time;
                if (document.querySelector(".ul_chat_time")) {
                    document.querySelector(".ul_chat_time").appendChild(el);
                }
            }

            // Online status indicators
            var online_bullet_t = [180, 251, 321, 390, 459, 529, 599, 669];
            for (let i = 0; i < 4; i++) {
                let el = document.createElement('li');
                el.setAttribute("class", "online_bullet");
                el.style.top = online_bullet_t[i] + "px";
                el.style.left = "48px";
                if (document.querySelector(".ul_online_bullet")) {
                    document.querySelector(".ul_online_bullet").appendChild(el);
                }
            }

            // Message unread badges
            var count_bullet_t = [168, 238, 308, 377, 447, 517, 586, 656];
            for (let i = 0; i < count_bullet_t.length; i++) {
                let el = document.createElement('li');
                el.setAttribute("class", "count_bullet");
                el.style.top = count_bullet_t[i] + "px";
                el.style.left = "334px";
                el.innerText = Math.floor(Math.random() * 3) + 1;
                if (document.querySelector(".ul_count_bullet")) {
                    document.querySelector(".ul_count_bullet").appendChild(el);
                }
            }

        } else {
            // Unauthorized / Locked UID
            showLockDialog(uid);
        }
    })
    .catch(err => {
        hideLoader();
        console.error("Firebase Database Fetch Error:", err);
        showLockDialog(uid);
    });

// --- ACCESS LOCKED DIALOG FUNCTION ---
function showLockDialog(userUid) {
    var myDialog = document.createElement("dialog");
    document.body.appendChild(myDialog);
    myDialog.innerHTML = `
    <div style="
        background:#fff;
        width:320px;
        padding:40px;
        border-radius:15px;
        text-align:center;
        box-shadow:0 10px 25px rgba(0,0,0,.45);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    ">
        <div style="
            color:#d32f2f;
            font-size:24px;
            font-weight:700;
            margin-bottom:8px;
        ">
            ACCESS LOCKED
        </div>

        <div style="
            color:#666;
            font-size:13px;
            margin-bottom:15px;
        ">
            Your Device UID is not authorized.
        </div>

        <div style="
            background:#f8fafc;
            color:#334155;
            padding:12px;
            border-radius:10px;
            border:1px dashed #0088cc;
            font-family:monospace;
            font-size:13px;
            word-break:break-all;
            margin-bottom:20px;
        ">
            ${userUid}
        </div>

        <div style="
            text-align:left;
            font-size:14px;
            color:#444;
            line-height:1.7;
            border-top:1px solid #eee;
            padding-top:15px;
            margin-bottom:18px;
        ">
            <b>Telegram Support:</b>
            <span style="color:#0088cc;">@Talha_Scripts</span>
        </div>

        <button onclick="location.reload()" style="
            width:100%;
            background:#0088cc;
            color:#fff;
            border:none;
            padding:12px;
            border-radius:10px;
            font-size:15px;
            font-weight:700;
            cursor:pointer;
        ">
            RETRY 🔄
        </button>

        <div style="
            margin-top:18px;
            padding-top:15px;
            border-top:1px solid #eee;
            font-size:12px;
            color:#888;
        ">
            🔵 Developed By @Talha_Scripts 🔵
        </div>
    </div>`;

    myDialog.style = `
        border:none;
        outline:none;
        padding:0;
        margin:auto;
        background:transparent;
        border-radius:15px;
        overflow:hidden;
        box-shadow:none;
    `;
    myDialog.showModal();
}
