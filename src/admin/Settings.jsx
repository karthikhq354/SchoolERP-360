import React, { useState } from "react";

const Settings = () => {

const [profile, setProfile] = useState({
name: "Admin User",
email: "admin@example.com",
phone: "9876543210"
});

const [password, setPassword] = useState({
current: "",
newPass: "",
confirm: ""
});

const [system, setSystem] = useState({
notifications: true,
darkMode: false,
autoBackup: true
});

const handleProfileChange = (e) => {
setProfile({
...profile,
[e.target.name]: e.target.value
});
};

const saveProfile = () => {
alert("Profile Updated Successfully");
};

const handlePasswordChange = (e) => {
setPassword({
...password,
[e.target.name]: e.target.value
});
};

const updatePassword = () => {

if(password.newPass !== password.confirm){
alert("Passwords do not match");
return;
}

alert("Password Updated Successfully");
};

const toggleSetting = (key) => {
setSystem({
...system,
[key]: !system[key]
});
};

return (

<div className="p-8">

<h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

{/* PROFILE SETTINGS */}

<div className="bg-white shadow-lg rounded-xl p-6 mb-8">

<h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<input
type="text"
name="name"
value={profile.name}
onChange={handleProfileChange}
className="border p-3 rounded-lg"
placeholder="Name"
/>

<input
type="email"
name="email"
value={profile.email}
onChange={handleProfileChange}
className="border p-3 rounded-lg"
placeholder="Email"
/>

<input
type="text"
name="phone"
value={profile.phone}
onChange={handleProfileChange}
className="border p-3 rounded-lg"
placeholder="Phone"
/>

</div>

<button
onClick={saveProfile}
className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
>
Save Profile
</button>

</div>


{/* PASSWORD SETTINGS */}

<div className="bg-white shadow-lg rounded-xl p-6 mb-8">

<h2 className="text-xl font-semibold mb-4">Change Password</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<input
type="password"
name="current"
placeholder="Current Password"
onChange={handlePasswordChange}
className="border p-3 rounded-lg"
/>

<input
type="password"
name="newPass"
placeholder="New Password"
onChange={handlePasswordChange}
className="border p-3 rounded-lg"
/>

<input
type="password"
name="confirm"
placeholder="Confirm Password"
onChange={handlePasswordChange}
className="border p-3 rounded-lg"
/>

</div>

<button
onClick={updatePassword}
className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
>
Update Password
</button>

</div>


{/* SYSTEM SETTINGS */}

<div className="bg-white shadow-lg rounded-xl p-6">

<h2 className="text-xl font-semibold mb-4">System Settings</h2>

<div className="space-y-4">

<div className="flex justify-between items-center">

<span>Enable Notifications</span>

<button
onClick={() => toggleSetting("notifications")}
className={`px-4 py-2 rounded-lg ${
system.notifications ? "bg-green-500 text-white" : "bg-gray-300"
}`}
>
{system.notifications ? "ON" : "OFF"}
</button>

</div>

<div className="flex justify-between items-center">

<span>Dark Mode</span>

<button
onClick={() => toggleSetting("darkMode")}
className={`px-4 py-2 rounded-lg ${
system.darkMode ? "bg-green-500 text-white" : "bg-gray-300"
}`}
>
{system.darkMode ? "ON" : "OFF"}
</button>

</div>

<div className="flex justify-between items-center">

<span>Auto Backup</span>

<button
onClick={() => toggleSetting("autoBackup")}
className={`px-4 py-2 rounded-lg ${
system.autoBackup ? "bg-green-500 text-white" : "bg-gray-300"
}`}
>
{system.autoBackup ? "ON" : "OFF"}
</button>

</div>

</div>

</div>

</div>
);
};

export default Settings;