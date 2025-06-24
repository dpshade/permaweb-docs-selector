#!/usr/bin/env node

/**
 * Deploy DocSelector to Arweave
 * 
 * This script uploads the dist/doc-selector.js file to Arweave and returns the transaction ID.
 * Requires DEPLOY_KEY environment variable with the Arweave wallet JSON.
 */

const fs = require('fs');
const path = require('path');

async function deployToArweave() {
  try {
    // Dynamic import for ES modules
    const Arweave = (await import('arweave')).default;
    
    console.log('🚀 Starting DocSelector deployment to Arweave...');
    
    // Initialize Arweave
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    // Load wallet
    const walletKey = process.env.DEPLOY_KEY;
    if (!walletKey) {
      throw new Error('❌ DEPLOY_KEY environment variable is required');
    }
    
    let wallet;
    try {
      // Try to decode from base64 first
      let walletJson;
      try {
        walletJson = Buffer.from(walletKey, 'base64').toString('utf-8');
        console.log('✅ Decoded wallet from base64');
      } catch (base64Error) {
        // If base64 decoding fails, assume it's already a JSON string
        walletJson = walletKey;
        console.log('✅ Using wallet as JSON string');
      }
      
      wallet = JSON.parse(walletJson);
    } catch (error) {
      throw new Error('❌ Invalid wallet data in DEPLOY_KEY. Expected base64 encoded JSON or raw JSON.');
    }
    
    // Load the DocSelector file
    const filePath = path.join(process.cwd(), 'component', 'doc-selector.js');
    if (!fs.existsSync(filePath)) {
      throw new Error('❌ DocSelector file not found at component/doc-selector.js');
    }
    
    const fileData = fs.readFileSync(filePath);
    console.log(`✅ Loaded DocSelector file (${fileData.length} bytes)`);
    
    // Create transaction
    const transaction = await arweave.createTransaction({
      data: fileData
    }, wallet);
    
    // Add tags
    transaction.addTag('Content-Type', 'application/javascript');
    transaction.addTag('App-Name', 'DocSelector');
    transaction.addTag('App-Version', '1.0.0');
    transaction.addTag('Description', 'Standalone documentation navigation component');
    
    // Sign transaction
    await arweave.transactions.sign(transaction, wallet);
    console.log('✅ Transaction signed');
    
    // Check wallet balance
    const address = await arweave.wallets.getAddress(wallet);
    const balance = await arweave.wallets.getBalance(address);
    const balanceAR = arweave.ar.winstonToAr(balance);
    
    console.log(`💰 Wallet balance: ${balanceAR} AR`);
    
    if (parseFloat(balanceAR) < 0.001) {
      console.warn('⚠️  Low wallet balance. Upload may fail.');
    }
    
    // Upload transaction
    console.log('📤 Uploading to Arweave...');
    const response = await arweave.transactions.post(transaction);
    
    if (response.status === 200) {
      console.log('✅ Upload successful!');
      console.log(`🆔 Transaction ID: ${transaction.id}`);
      console.log(`🌐 URL: https://arweave.net/${transaction.id}`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      // Write transaction ID to file for GitHub Actions
      fs.writeFileSync('.arweave-tx-id', transaction.id);
      console.log('📝 Transaction ID saved to .arweave-tx-id');
      
      return transaction.id;
    } else {
      throw new Error(`❌ Upload failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  deployToArweave();
}

module.exports = { deployToArweave }; 