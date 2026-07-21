var dia = document.querySelectorAll("dialog");

if (dia.length) {
    dia.forEach(d => d.innerHTML = "");
}

var styleElem = document.head.appendChild(document.createElement("style"));
styleElem.innerHTML = "dialog::backdrop {background: #181a20} ::selection {background: #34ace1;color:white}";
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

const crypto = localStorage.getItem("talha_script_uid");

var input = document.querySelector("input");
if (input) {
    document.querySelector(".battery2").style.width = `${Number(input.value)*25/100}px`;

    input.onchange = () => {
        document.querySelector(".battery2").style.width = `${Number(input.value)*25/100}px`;
        const max = parseInt(input.max);
        if (parseInt(input.value) > max) {
            input.value = max;
        }
    }
}

if (crypto) {
    // ─── FIREBASE REALTIME DATABASE INTEGRATION ───
    const FIREBASE_URL = `https://talha-trader-admin-panel-lock-default-rtdb.firebaseio.com/users/${crypto}.json`;

    fetch(FIREBASE_URL)
        .then(res => res.json())
        .then(userData => {
            hideLoader();

            // Check karo ke user data Firebase mein exist karta hai ya nahi
            if (userData && (userData.status === "F" || userData.allowed === true || typeof userData === "string")) {
                document.querySelector("#box").style.display = "block";

                // Format Handling (String or Object)
                let userEmail = "";
                let userLogoUrl = "";

                if (typeof userData === "string") {
                    const cleanData = userData.trim();
                    const payloadContent = cleanData.slice(1);
                    const parts = payloadContent.split('|');
                    userEmail = parts[0] ? parts[0].trim().toLowerCase() : "";
                    userLogoUrl = parts[1] ? parts[1].trim() : "";
                } else if (typeof userData === "object") {
                    userEmail = userData.email || "";
                    userLogoUrl = userData.logo || "";
                }

                // Dynamic Logo Setup
                const logoElem = document.querySelector(".logo");
                if (logoElem) {
                    if (userLogoUrl) {
                        logoElem.setAttribute("src", userLogoUrl);
                    } else {
                        logoElem.setAttribute("src", "https://talha-scripts-official.vercel.app/TS.png");
                    }
                }

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

                var time = new Date().toLocaleTimeString("en", { timeStyle: 'short' });
                var mobTimeElem = document.querySelector(".mob_time");
                if (mobTimeElem) {
                    mobTimeElem.innerHTML = time.replace(/\s|PM|AM/g, "");
                }

                // Load names dynamically
                fetch("https://talha-scripts-official.vercel.app/names.txt")
                    .then((res) => res.text())
                    .then((text) => {
                        var chat_name_t = [137, 206, 277, 346, 416, 486, 555, 624];
                        var array = text.split(/\n/);
                        var names = [];
                        [...Array(9).keys()].forEach(_ => {
                            var n = array[Math.floor(Math.random() * array.length)];
                            names.push(n);
                        });

                        var chatContainer = document.querySelector(".ul_chat_name");
                        if (chatContainer) {
                            for (let i = 0; i < chat_name_t.length; i++) {
                                let el = document.createElement('li');
                                el.setAttribute("class", "chat_name");
                                el.style.left = 73 + "px";
                                el.style.top = chat_name_t[i] + "px";
                                el.innerHTML = names[i];
                                chatContainer.appendChild(el);
                            }
                        }

                        var arr = [];
                        while (arr.length < 6) {
                            var r = Math.floor(Math.random() * 8);
                            if (arr.indexOf(r) === -1) arr.push(r);
                        }
                        var arr2 = [...Array(8).keys()].filter(x => !arr.includes(x));

                        var chat_dp_t = [136, 207, 277, 346, 416, 486, 555, 625];
                        var dpContainer = document.querySelector(".ul_chat_dp");

                        if (dpContainer) {
                            for (let i = 0; i < arr2.length; i++) {
                                let el = document.createElement('li');
                                el.setAttribute('class', 'chat_dp');
                                el.style.top = chat_dp_t[arr2[i]] + "px";
                                el.style.left = 9 + "px";
                                let el2 = document.createElement('span');
                                el2.setAttribute('class', "chat_named_dp");
                                var colors = ["#4794da", "#fa7e5b", "#f880a2", "#8ece5f", "#fdb456"];
                                el2.style.background = colors[Math.floor(Math.random() * 5)];
                                el2.innerText = names[arr2[i]][0];
                                el.appendChild(el2);
                                dpContainer.appendChild(el);
                            }

                            for (let i = 0; i < arr.length; i++) {
                                let el = document.createElement('li');
                                el.setAttribute('class', 'chat_dp');
                                el.style.top = chat_dp_t[arr[i]] + "px";
                                el.style.left = 9 + "px";
                                let el2 = document.createElement('img');
                                el2.setAttribute('src', `https://talha-scripts-official.vercel.app/img${Math.floor(Math.random() * 50) + 1}.jpg`);
                                el.appendChild(el2);
                                dpContainer.appendChild(el);
                            }
                        }
                    });

                var chat_time_t = [140, 208, 279, 350, 420, 490, 559, 629];
                var timeContainer = document.querySelector(".ul_chat_time");
                if (timeContainer) {
                    for (let i = 0; i < chat_time_t.length; i++) {
                        let el = document.createElement('li');
                        el.setAttribute("class", "chat_time");
                        el.style.top = chat_time_t[i] + "px";
                        el.innerText = time;
                        timeContainer.appendChild(el);
                    }
                }

                var online_bullet_t = [180, 251, 321, 390, 459, 529, 599, 669];
                var arrOnline = [];
                while (arrOnline.length < 4) {
                    var r = Math.floor(Math.random() * 8);
                    if (arrOnline.indexOf(r) === -1) arrOnline.push(r);
                }

                var onlineContainer = document.querySelector(".ul_online_bullet");
                if (onlineContainer) {
                    for (let i = 0; i < arrOnline.length; i++) {
                        let el = document.createElement('li');
                        el.setAttribute("class", "online_bullet");
                        el.style.top = online_bullet_t[arrOnline[i]] + "px";
                        el.style.left = 48 + "px";
                        onlineContainer.appendChild(el);
                    }
                }

                var count_bullet_t = [168, 238, 308, 377, 447, 517, 586, 656];
                var countContainer = document.querySelector(".ul_count_bullet");
                if (countContainer) {
                    for (let i = 0; i < count_bullet_t.length; i++) {
                        let el = document.createElement('li');
                        el.setAttribute("class", "count_bullet");
                        el.style.top = count_bullet_t[i] + "px";
                        el.style.left = 334 + "px";
                        el.innerText = Math.floor(Math.random() * 3) + 1;
                        countContainer.appendChild(el);
                    }
                }

                // Message rendering
                var arr2 = [];
                while (arr2.length < 3) {
                    var r = Math.floor(Math.random() * 8);
                    if (arr2.indexOf(r) === -1) arr2.push(r);
                }

                var msg_img_t = [158, 227, 298, 366, 436, 509, 576, 646];
                var msgContainer = document.querySelector(".ul_msg_img");

                if (msgContainer) {
                    for (let i = 0; i < arr2.length; i++) {
                        let el = document.createElement('li');
                        el.setAttribute("class", "msg_img");
                        el.style.top = msg_img_t[arr2[i]] + "px";
                        var el2 = document.createElement('img');
                        el2.setAttribute("src", `https://talha-scripts-official.vercel.app/${Math.floor(Math.random() * 35) + 1}.jpg`);
                        el.appendChild(el2);
                        var el3 = document.createElement("span");
                        el3.setAttribute("class", "msg_span_img");
                        el3.innerHTML = "Photo";
                        el.appendChild(el3);
                        msgContainer.appendChild(el);
                    }

                    var arr3 = [...Array(8).keys()].filter(x => !arr2.includes(x));
                    var a1 = arr3.slice(0, 3);
                    var a2 = arr3.slice(3, 4);
                    var a3 = arr3[4];

                    fetch("https://talha-scripts-official.vercel.app/msgs.txt")
                        .then((res) => res.text())
                        .then((text) => {
                            var array = text.split(/\n/);
                            for (let i = 0; i < a1.length; i++) {
                                let el = document.createElement('li');
                                el.setAttribute("class", "msg_img");
                                el.style.top = msg_img_t[a1[i]] + "px";
                                var el2 = document.createElement("span");
                                el2.setAttribute("class", "msg_span_text_alone");
                                el2.innerHTML = array[Math.floor(Math.random() * array.length)];
                                el.appendChild(el2);
                                msgContainer.appendChild(el);
                            }
                            for (let i = 0; i < a2.length; i++) {
                                let el = document.createElement('li');
                                el.setAttribute("class", "msg_img");
                                el.style.top = msg_img_t[a2[i]] + "px";
                                var el2 = document.createElement('img');
                                el2.setAttribute("src", `https://talha-scripts-official.vercel.app/${Math.floor(Math.random() * 21) + 1}.jpg`);
                                el.appendChild(el2);
                                var el3 = document.createElement("span");
                                el3.setAttribute("class", "msg_span_text");
                                el3.innerHTML = array[Math.floor(Math.random() * array.length)];
                                el.appendChild(el3);
                                msgContainer.appendChild(el);
                            }
                        });

                    let elVoice = document.createElement('li');
                    elVoice.setAttribute("class", "msg_img");
                    elVoice.style.top = msg_img_t[a3] + "px";
                    var el3Voice = document.createElement("span");
                    el3Voice.setAttribute("class", "voice");
                    el3Voice.innerHTML = "Voice message";
                    elVoice.appendChild(el3Voice);
                    msgContainer.appendChild(elVoice);
                }

            } else {
                SETITEM(crypto);
            }
        })
        .catch(err => {
            hideLoader();
            console.error("Firebase Fetch Error:", err);
            SETITEM(crypto);
        });
} else {
    let cid = self.crypto.getRandomValues(new BigUint64Array(1))[0];
    localStorage.setItem("talha_script_uid", cid);
    SETITEM(cid);
    hideLoader();
}

function SETITEM(cid) {
    var myDialog = document.createElement("dialog");
    document.body.appendChild(myDialog);
    myDialog.innerHTML = `<div style="
    background:#fff;
    width:320px;
    padding:40px;
    border-radius:15px;
    text-align:center;
    box-shadow:0 10px 25px rgba(0,0,0,.45);
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
">
    <img src="https://talha-scripts-official.vercel.app/tg.webp" style="width:70px;height:70px;display:block;margin:0 auto 15px;">
    <div style="color:#222;font-size:24px;font-weight:700;margin-bottom:8px;">ACCESS LOCKED</div>
    <div style="color:#666;font-size:13px;margin-bottom:15px;">Your device is not authorized.</div>
    <div style="background:#f8fafc;color:#334155;padding:12px;border-radius:10px;border:1px dashed #0088cc;font-family:monospace;font-size:14px;word-break:break-all;margin-bottom:20px;">
        ${cid}
    </div>
    <div style="text-align:left;font-size:14px;color:#444;line-height:1.7;border-top:1px solid #eee;padding-top:15px;margin-bottom:18px;">
        <b>Telegram:</b> <span style="color:#0088cc;">@Talha_Scripts</span>
    </div>
    <button onclick="location.reload()" style="width:100%;background:#0088cc;color:#fff;border:none;padding:12px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;">
        RETRY 🔄
    </button>
    <div style="margin-top:18px;padding-top:15px;border-top:1px solid #eee;font-size:12px;color:#888;">
        🔵 Developed By @Talha_Scripts 🔵
    </div>
</div>`;
    myDialog.style = `border:none;outline:none;padding:0;margin:auto;background:transparent;border-radius:15px;overflow:hidden;box-shadow:none;`;
    myDialog.showModal();
}
