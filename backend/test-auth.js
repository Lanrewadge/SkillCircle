const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAuth() {
  try {
    // Test registration
    console.log('Testing registration...');
    const registerResponse = await fetch('http://localhost:3001/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'TestPass123!',
        name: 'Test User',
        role: 'student'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', JSON.stringify(registerData, null, 2));

    if (registerData.success) {
      console.log('Registration successful!');

      // Test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPass123!'
        })
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', JSON.stringify(loginData, null, 2));
    }
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testAuth();