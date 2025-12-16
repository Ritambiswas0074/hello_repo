import app from './app';
import prisma from './config/database';

const PORT = process.env.PORT || 5000;

async function connectWithRetry(maxRetries = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔌 Attempting to connect to database (attempt ${attempt}/${maxRetries})...`);
      await prisma.$connect();
      console.log('✅ Database connected');
      return true;
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error; // Re-throw on final attempt
      }
      console.log(`⚠️  Connection attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

async function startServer() {
  try {
    // Test database connection with retry (Neon pooler may need warm-up time)
    await connectWithRetry(3, 2000);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error);
    
    // Provide helpful error messages for common issues
    if (error.code === 'P1001') {
      console.error('\n💡 Database Connection Error (P1001):');
      console.error('   The database server is unreachable after multiple attempts.');
      console.error('\n   Possible solutions:');
      console.error('   1. Check if your Neon database is paused (Neon pauses inactive databases)');
      console.error('      → Go to your Neon dashboard and resume the database');
      console.error('   2. Verify your DATABASE_URL in .env file is correct');
      console.error('   3. Try using direct connection instead of pooler (replace "pooler" with "direct" in DATABASE_URL)');
      console.error('   4. Check your internet connection');
      console.error('   5. Wait 30-60 seconds and try again (Neon pooler may need warm-up)');
    } else if (error.code === 'P1017') {
      console.error('\n💡 Database Connection Error (P1017):');
      console.error('   The database server closed the connection.');
      console.error('   This might indicate the database is paused or the connection string is incorrect.');
    }
    
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

