const BASE_URL = 'http://127.0.0.1:5000/api';
let authToken = '';

async function safeSignup(user) {
    try {
        console.log(`Creating user ${user.Email}...`);
        const res = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Signup successful');
        } else {
            console.log(`ℹ️ Signup info: ${data.message} (Likely already exists)`);
        }
    } catch (err) {
        console.log(`⚠️ Signup skipped/failed: ${err.message}`);
    }
}

const tests = {
    donor: async () => {
        console.log('\n--- Testing Donor Endpoints ---');
        try {
            // 0. Ensure user exists
            await safeSignup({
                Name: "Test Donor",
                Email: "testdonor@example.com",
                Password: "password123",
                Role: "DONOR",
                Bloodgroup: "O+",
                City: "Test City",
                State: "Test State",
                Pincode: "123456"
            });

            // 1. Login
            console.log('Logging in as donor...');
            const loginRes = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: 'testdonor@example.com',
                    Password: 'password123',
                    Role: 'DONOR'
                })
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

            authToken = loginData.accessToken;
            console.log('✅ Login successful');

            const headers = {
                'Authorization': `Bearer ${authToken}`
            };

            // 2. Get Me
            const meRes = await fetch(`${BASE_URL}/donor/me`, { headers });
            const meData = await meRes.json();
            console.log(`✅ Get Me: ${meRes.status} (Eligible: ${meData.eligible})`);

            // 3. Get Stats
            const statsRes = await fetch(`${BASE_URL}/donor/stats`, { headers });
            const statsData = await statsRes.json();
            console.log(`✅ Get Stats: ${statsRes.status} (Total: ${statsData.totalDonations})`);

            // 4. Get Appointments
            const apptRes = await fetch(`${BASE_URL}/donor/appointments`, { headers });
            const apptData = await apptRes.json();
            console.log(`✅ Get Appointments: ${apptRes.status} (Count: ${Array.isArray(apptData) ? apptData.length : 'Error'})`);

        } catch (err) {
            console.error('❌ Donor Test Failed:', err.message);
        }
    },

    admin: async () => {
        console.log('\n--- Testing Admin Endpoints ---');
        try {
            // 0. Ensure admin exists (Using a secret key if your signup requires it, assuming standard signup for now or manual)
            // Admin signup usually restricted. I'll assume valid credentials or try to create one if allowed endpoint exists.
            // Assuming standard signup works for ADMIN role for testing dev purposes, or fallback to existing 'admin@liforce.com'

            // Caution: Providing a known admin seed or trying to use one from previous sessions.
            // I'll try to signup a test admin.
            await safeSignup({
                Name: "Test Admin",
                Email: "testadmin@liforce.com",
                Password: "adminpassword",
                Role: "ADMIN",
                City: "Admin HQ",
                State: "Admin State",
                Pincode: "000000"
            });

            // 1. Login
            console.log('Logging in as admin...');
            const loginRes = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: 'testadmin@liforce.com',
                    Password: 'adminpassword',
                    Role: 'ADMIN'
                })
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');

            const token = loginData.accessToken;
            const headers = { 'Authorization': `Bearer ${token}` };
            console.log('✅ Admin Login successful');

            // 2. Get Summary
            const summaryRes = await fetch(`${BASE_URL}/admin/summary`, { headers });
            console.log(`✅ Get Summary: ${summaryRes.status}`);

            // 3. Get Pending Counts
            const pendingRes = await fetch(`${BASE_URL}/admin/pending-counts`, { headers });
            console.log(`✅ Get Pending Counts: ${pendingRes.status}`);

        } catch (err) {
            console.error('❌ Admin Test Failed:', err.message);
        }
    }
};

const run = async () => {
    const args = process.argv.slice(2);
    const suite = args[0] || 'all';

    if (suite === 'all' || suite === 'donor') await tests.donor();
    if (suite === 'all' || suite === 'admin') await tests.admin();
};

run();
