let url = "https://nala-test.com";


/////////////////////////////////////////////////////////////////////////////////
//// LOGOUT
/////////////////////////////////////////////////////////////////////////////////
async function doLogout() {
    wc.group("doLogout");

    const res = await fetch(url + "/api/auth_logout.php", {
	method: "POST",
	credentials: "include"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Logout failed");
    let currentUser = null;
    console.log("logged out", data);

    wc.log("logged out");
    wc.groupEnd();;
}

/////////////////////////////////////////////////////////////////////////////////
//// LOGIN
/////////////////////////////////////////////////////////////////////////////////
async function doLogin(email,passwd) {
    wc.group("doLogin");

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
    wc.log("data:", data);

    if (!res.ok) {
	alert("DoLogin: Error BBBBBB");
	wc.groupEnd();
	return false;
    }
    
    wc.groupEnd();
    return true;
}
