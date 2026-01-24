/**
 * Seed Data Script
 * Populates the database with sample data for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

// Import models
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Retailer = require('../models/Retailer');
const Agent = require('../models/Agent');
const Produce = require('../models/Produce');
const Order = require('../models/Order');

// Sample data
const sampleUsers = [
  // Farmers
  {
    email: 'farmer1@agri360.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'farmer',
    address: {
      street: '123 Farm Road',
      city: 'Rural City',
      state: 'State A',
      zipCode: '12345',
      country: 'Country',
    },
    location: {
      region: 'North Region',
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
  {
    email: 'farmer2@agri360.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'farmer',
    address: {
      street: '456 Farm Street',
      city: 'Rural City',
      state: 'State A',
      zipCode: '12345',
      country: 'Country',
    },
    location: {
      region: 'North Region',
      latitude: 40.7580,
      longitude: -73.9855,
    },
  },
  {
    email: 'farmer3@agri360.com',
    password: 'password123',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+1234567892',
    role: 'farmer',
    address: {
      street: '789 Farm Lane',
      city: 'Rural City',
      state: 'State B',
      zipCode: '54321',
      country: 'Country',
    },
    location: {
      region: 'South Region',
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
  // Retailers
  {
    email: 'retailer1@agri360.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Williams',
    phone: '+1234567893',
    role: 'retailer',
    address: {
      street: '321 Store Avenue',
      city: 'Urban City',
      state: 'State A',
      zipCode: '12345',
      country: 'Country',
    },
    location: {
      region: 'North Region',
      latitude: 40.7614,
      longitude: -73.9776,
    },
  },
  {
    email: 'retailer2@agri360.com',
    password: 'password123',
    firstName: 'Charlie',
    lastName: 'Brown',
    phone: '+1234567894',
    role: 'retailer',
    address: {
      street: '654 Store Boulevard',
      city: 'Urban City',
      state: 'State A',
      zipCode: '12345',
      country: 'Country',
    },
    location: {
      region: 'North Region',
      latitude: 40.7282,
      longitude: -73.9942,
    },
  },
  {
    email: 'retailer3@agri360.com',
    password: 'password123',
    firstName: 'Diana',
    lastName: 'Davis',
    phone: '+1234567895',
    role: 'retailer',
    address: {
      street: '987 Store Street',
      city: 'Urban City',
      state: 'State B',
      zipCode: '54321',
      country: 'Country',
    },
    location: {
      region: 'South Region',
      latitude: 34.0635,
      longitude: -118.2788,
    },
  },
  // Ripening Agents
  {
    email: 'agent1@agri360.com',
    password: 'password123',
    firstName: 'Edward',
    lastName: 'Miller',
    phone: '+1234567896',
    role: 'agent',
    address: {
      street: '147 Facility Road',
      city: 'Industrial City',
      state: 'State A',
      zipCode: '12345',
      country: 'Country',
    },
    location: {
      region: 'North Region',
      latitude: 40.7505,
      longitude: -73.9934,
    },
  },
  {
    email: 'agent2@agri360.com',
    password: 'password123',
    firstName: 'Fiona',
    lastName: 'Wilson',
    phone: '+1234567897',
    role: 'agent',
    address: {
      street: '258 Facility Avenue',
      city: 'Industrial City',
      state: 'State B',
      zipCode: '54321',
      country: 'Country',
    },
    location: {
      region: 'South Region',
      latitude: 34.0928,
      longitude: -118.3287,
    },
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Retailer.deleteMany({});
    await Agent.deleteMany({});
    await Produce.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared.');

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`${createdUsers.length} users created.`);

    // Create farmer profiles
    const farmers = createdUsers.filter(u => u.role === 'farmer');
    const farmerProfiles = await Farmer.insertMany([
      {
        userId: farmers[0]._id,
        farmName: "Doe's Organic Farm",
        farmSize: 50,
        crops: [
          { cropName: 'Tomatoes', cropType: 'vegetable', plantingDate: new Date('2024-01-01'), expectedHarvestDate: new Date('2024-04-01') },
          { cropName: 'Apples', cropType: 'fruit', plantingDate: new Date('2023-03-01'), expectedHarvestDate: new Date('2024-09-01') },
        ],
        bio: 'Organic farmer with 20 years of experience',
        rating: 4.5,
      },
      {
        userId: farmers[1]._id,
        farmName: "Smith's Green Farm",
        farmSize: 75,
        crops: [
          { cropName: 'Bananas', cropType: 'fruit', plantingDate: new Date('2024-02-01'), expectedHarvestDate: new Date('2024-05-01') },
          { cropName: 'Potatoes', cropType: 'vegetable', plantingDate: new Date('2024-01-15'), expectedHarvestDate: new Date('2024-04-15') },
        ],
        bio: 'Sustainable farming practices',
        rating: 4.8,
      },
      {
        userId: farmers[2]._id,
        farmName: "Johnson's Fresh Farm",
        farmSize: 100,
        crops: [
          { cropName: 'Oranges', cropType: 'fruit', plantingDate: new Date('2023-06-01'), expectedHarvestDate: new Date('2024-11-01') },
        ],
        bio: 'Family-owned farm since 1950',
        rating: 4.2,
      },
    ]);
    console.log(`${farmerProfiles.length} farmer profiles created.`);

    // Create retailer profiles
    const retailers = createdUsers.filter(u => u.role === 'retailer');
    const retailerProfiles = await Retailer.insertMany([
      {
        userId: retailers[0]._id,
        storeName: "Williams Fresh Market",
        storeType: 'supermarket',
        businessLicense: 'LIC-001',
        preferredRegions: ['North Region'],
        rating: 4.6,
        totalOrders: 0,
      },
      {
        userId: retailers[1]._id,
        storeName: "Brown's Grocery Store",
        storeType: 'grocery',
        businessLicense: 'LIC-002',
        preferredRegions: ['North Region'],
        rating: 4.4,
        totalOrders: 0,
      },
      {
        userId: retailers[2]._id,
        storeName: "Davis Wholesale",
        storeType: 'wholesale',
        businessLicense: 'LIC-003',
        preferredRegions: ['South Region'],
        rating: 4.7,
        totalOrders: 0,
      },
    ]);
    console.log(`${retailerProfiles.length} retailer profiles created.`);

    // Create agent profiles
    const agents = createdUsers.filter(u => u.role === 'agent');
    const agentProfiles = await Agent.insertMany([
      {
        userId: agents[0]._id,
        facilityName: "Miller Ripening Facility",
        facilityCapacity: 10000,
        facilityType: 'ripening',
        certifications: ['ISO 9001', 'Organic Certified'],
        rating: 4.5,
        isAvailable: true,
      },
      {
        userId: agents[1]._id,
        facilityName: "Wilson Storage & Ripening",
        facilityCapacity: 15000,
        facilityType: 'both',
        certifications: ['ISO 9001'],
        rating: 4.3,
        isAvailable: true,
      },
    ]);
    console.log(`${agentProfiles.length} agent profiles created.`);

    // Create sample produce
    console.log('Creating sample produce...');
    const sampleProduce = await Produce.insertMany([
      {
        farmerId: farmerProfiles[0]._id,
        userId: farmers[0]._id,
        cropName: 'Tomatoes',
        cropType: 'vegetable',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 25,
        harvestDate: new Date('2024-03-15'),
        expiryDate: new Date('2024-04-15'),
        quality: 'premium',
        description: 'Fresh organic tomatoes, harvested yesterday',
        images: [],
        status: 'available',
        location: { region: 'North Region' },
      },
      {
        farmerId: farmerProfiles[0]._id,
        userId: farmers[0]._id,
        cropName: 'Apples',
        cropType: 'fruit',
        quantity: 1000,
        unit: 'kg',
        pricePerUnit: 30,
        harvestDate: new Date('2024-08-20'),
        expiryDate: new Date('2024-10-20'),
        quality: 'good',
        description: 'Fresh red apples',
        images: [],
        status: 'available',
        location: { region: 'North Region' },
      },
      {
        farmerId: farmerProfiles[1]._id,
        userId: farmers[1]._id,
        cropName: 'Bananas',
        cropType: 'fruit',
        quantity: 800,
        unit: 'kg',
        pricePerUnit: 20,
        harvestDate: new Date('2024-04-10'),
        expiryDate: new Date('2024-04-20'),
        quality: 'premium',
        description: 'Ripe bananas, ready for ripening',
        images: [],
        status: 'available',
        location: { region: 'North Region' },
      },
      {
        farmerId: farmerProfiles[1]._id,
        userId: farmers[1]._id,
        cropName: 'Potatoes',
        cropType: 'vegetable',
        quantity: 1200,
        unit: 'kg',
        pricePerUnit: 15,
        harvestDate: new Date('2024-04-05'),
        expiryDate: new Date('2024-06-05'),
        quality: 'good',
        description: 'Fresh potatoes',
        images: [],
        status: 'available',
        location: { region: 'North Region' },
      },
      {
        farmerId: farmerProfiles[2]._id,
        userId: farmers[2]._id,
        cropName: 'Oranges',
        cropType: 'fruit',
        quantity: 600,
        unit: 'kg',
        pricePerUnit: 35,
        harvestDate: new Date('2024-10-15'),
        expiryDate: new Date('2024-12-15'),
        quality: 'premium',
        description: 'Sweet oranges from South Region',
        images: [],
        status: 'available',
        location: { region: 'South Region' },
      },
    ]);
    console.log(`${sampleProduce.length} produce items created.`);

    console.log('\n✅ Seed data populated successfully!');
    console.log('\nSample login credentials:');
    console.log('Farmers:');
    console.log('  - farmer1@agri360.com / password123');
    console.log('  - farmer2@agri360.com / password123');
    console.log('Retailers:');
    console.log('  - retailer1@agri360.com / password123');
    console.log('  - retailer2@agri360.com / password123');
    console.log('Agents:');
    console.log('  - agent1@agri360.com / password123');
    console.log('  - agent2@agri360.com / password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
