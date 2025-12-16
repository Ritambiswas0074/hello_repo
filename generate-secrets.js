#!/usr/bin/env node

// Script to generate secure JWT secrets for deployment

const crypto = require('crypto');

console.log('🔐 Generating JWT Secrets for Render Deployment');
console.log('================================================\n');

const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('Copy these values to your Render environment variables:\n');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log('\nJWT_REFRESH_SECRET:');
console.log(jwtRefreshSecret);
console.log('\n✅ Secrets generated!');
console.log('\n⚠️  Keep these secrets secure and never commit them to git!');
