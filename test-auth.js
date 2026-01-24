// Simple test script to verify authentication

const API_BASE = 'http://localhost:5000';

async function testLogin() {
  try {
    console.log('Testing login...');
    
    // Test farmer login
    const farmerLogin = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'farmer1@agri360.com',
        password: 'password123'
      })
    });
    
    const farmerResult = await farmerLogin.json();
    console.log('Farmer login:', farmerResult.success ? 'SUCCESS' : 'FAILED');
    if (farmerResult.success) {
      console.log('Farmer token:', farmerResult.data.token.substring(0, 20) + '...');
      console.log('Farmer role:', farmerResult.data.user.role);
    } else {
      console.log('Farmer error:', farmerResult.message);
    }
    
    // Test retailer login
    const retailerLogin = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'retailer1@agri360.com',
        password: 'password123'
      })
    });
    
    const retailerResult = await retailerLogin.json();
    console.log('Retailer login:', retailerResult.success ? 'SUCCESS' : 'FAILED');
    if (retailerResult.success) {
      console.log('Retailer token:', retailerResult.data.token.substring(0, 20) + '...');
      console.log('Retailer role:', retailerResult.data.user.role);
      
      // Test retailer dashboard
      const dashboardResponse = await fetch(`${API_BASE}/api/retailers/dashboard`, {
        headers: { 
          'Authorization': `Bearer ${retailerResult.data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const dashboardResult = await dashboardResponse.json();
      console.log('Retailer dashboard:', dashboardResult.success ? 'SUCCESS' : 'FAILED');
      if (dashboardResult.success) {
        console.log('Available produce count:', dashboardResult.data.availableProduce?.length || 0);
        console.log('Orders count:', dashboardResult.data.orders?.length || 0);
      } else {
        console.log('Dashboard error:', dashboardResult.message);
      }
    } else {
      console.log('Retailer error:', retailerResult.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testLogin();