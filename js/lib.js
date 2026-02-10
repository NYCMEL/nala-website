let url = "https://nala-test.com";

async function doLogout() {
    // LOGOUT
    const res = await fetch(url + "/api/auth_logout.php", {
	method: "POST",
	credentials: "include"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Logout failed");
    let currentUser = null;
    console.log("logged out", data);

    wc.log("logged out");
}

async function doLogin(email,passwd) {
    // LOGIN
    const res = await fetch(url + "/api/login_api.php", {
	method: "POST",
	credentials: "include",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
	    email: email,
	    password: passwd
	})
    });

    const data = await res.json();

    if (!res.ok) {
	alert("BBBBBB");
	return false;
    }
    
    return true;
}
