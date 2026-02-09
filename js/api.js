function apiBase() {
    const base = (document.getElementById("api_base").value || "/api").trim();
    wc.log("base:",base);

    return base.endsWith("/") ? base.slice(0, -1) : base;
}

function setLastMeta({method, url, status}) {
    wc.log("url:", url);

    document.getElementById("last_method").textContent = method;
    document.getElementById("last_url").textContent = url;
    document.getElementById("last_status").textContent = String(status ?? "");
}

function showReq(method, url, headers, body) {
    const payload = { method, url, headers, body: body ?? null };
    document.getElementById("req_out").textContent = JSON.stringify(payload, null, 2);
    return payload;
}

function showRes(status, headersObj, bodyText, parsedJson) {
    const payload = { status, headers: headersObj, body_text: bodyText, body_json: parsedJson ?? null };
    document.getElementById("res_out").textContent = JSON.stringify(payload, null, 2);
    return payload;
}

async function callApi({ method, path, jsonBody, cacheBust }) {
    let url = apiBase() + path;
    if (cacheBust) {
	const sep = url.includes("?") ? "&" : "?";
	url = url + sep + "ts=" + Date.now();
    }

    const headers = {};
    let body = undefined;

    if (jsonBody !== undefined) {
	headers["Content-Type"] = "application/json";
	body = JSON.stringify(jsonBody);
    }

    showReq(method, url, headers, jsonBody !== undefined ? jsonBody : null);

    try {
	const res = await fetch(url, { method, headers, body, credentials: "include" });

	const status = res.status;
	const headersObj = {};
	for (const [k, v] of res.headers.entries()) headersObj[k] = v;

	const text = await res.text();
	let parsed = null;
	try { parsed = JSON.parse(text); } catch {}

	setLastMeta({ method, url, status });
	showRes(status, headersObj, text, parsed);

	return { status, text, json: parsed };
    } catch (err) {
	setLastMeta({ method, url, status: "FETCH_ERROR" });
	const resPayload = { status: "FETCH_ERROR", error: String(err) };
	document.getElementById("res_out").textContent = JSON.stringify(resPayload, null, 2);
	return { status: 0, text: "", json: null };
    }
}

// -------- endpoints --------
async function me() {
    const r = await callApi({ method: "GET", path: "/me.php", cacheBust: true });
    document.getElementById("session_out").textContent =
	JSON.stringify(r.json ?? { raw: r.text, status: r.status }, null, 2);
}

async function login() {
    const email = document.getElementById("l_email").value.trim();
    const password = document.getElementById("l_password").value;

    await callApi({ method: "POST", path: "/login_api.php", jsonBody: { email, password } });
    setTimeout(me, 250);
}

async function logout() {
    await callApi({ method: "POST", path: "/auth_logout.php", jsonBody: {} });
    setTimeout(me, 250);
}

async function curriculum() {
    await callApi({ method: "GET", path: "/curriculum_api.php", cacheBust: true });
}

async function adminCreateUser() {
    const email = document.getElementById("a_email").value.trim();
    const password = document.getElementById("a_password").value;
    const name = document.getElementById("a_name").value.trim();
    const role = document.getElementById("a_role").value;
    const current_lesson = parseInt((document.getElementById("a_current_lesson").value || "0").trim(), 10) || 0;

    const payload = { email, password, role, current_lesson };
    if (name) payload.name = name;

    const r = await callApi({ method: "POST", path: "/admin_create_user.php", jsonBody: payload });

    const id = r?.json?.user?.id ?? null;
    if (id) {
	document.getElementById("u_user_id").value = String(id);
	document.getElementById("d_user_id").value = String(id);
    }
}

async function adminUpdateUser() {
    const user_id = parseInt((document.getElementById("u_user_id").value || "0").trim(), 10);
    if (!user_id) return alert("Enter a valid user_id");

    const payload = { user_id };

    const email = document.getElementById("u_email").value.trim();
    const name = document.getElementById("u_name").value.trim();
    const password = document.getElementById("u_password").value;
    const role = document.getElementById("u_role").value;
    const clRaw = (document.getElementById("u_current_lesson").value || "").trim();

    if (email) payload.email = email;
    if (name) payload.name = name;
    if (password) payload.password = password;
    if (role) payload.role = role;
    if (clRaw !== "") payload.current_lesson = parseInt(clRaw, 10);

    await callApi({ method: "POST", path: "/admin_update_user.php", jsonBody: payload });
}

async function adminDeleteUser() {
    const user_id = parseInt((document.getElementById("d_user_id").value || "0").trim(), 10);
    if (!user_id) return alert("Enter a valid user_id");
    const ok = confirm(`Delete user_id=${user_id}? This cannot be undone.`);
    if (!ok) return;
    await callApi({ method: "POST", path: "/admin_delete_user.php", jsonBody: { user_id } });
}

async function adminDeleteAllUsers() {
    const confirmStr = document.getElementById("da_confirm").value || "";
    const ok = confirm("Delete ALL USERS (testing)? This cannot be undone.");
    if (!ok) return;
    await callApi({ method: "POST", path: "/admin_delete_all_users.php", jsonBody: { confirm: confirmStr } });
}
