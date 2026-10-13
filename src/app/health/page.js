import PageLayout from '@/components/layout/pageLayout';

export async function generateMetadata() {
  return {
    title: 'Health Check - Hatla2ee',
    description: 'Application health status',
    robots: 'noindex, nofollow', //Don't index health check pages
  };
}

export default async function HealthCheck() {
  const timestamp = new Date().toISOString();
  const uptime = process.uptime();

  // Basic health check data
  const healthData = {
    status: 'healthy',
    timestamp: timestamp,
    uptime: `${Math.floor(uptime / 60)} minutes`,
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    nodeVersion: process.version,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      external: `${Math.round(
        process.memoryUsage().external / 1024 / 1024,
      )} MB`,
    },
    checks: {
      database: 'connected', // You can add actual DB health checks here
      cache: 'available', // You can add actual cache health checks here
      externalServices: 'operational', // You can add actual service health checks here
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏥 Application Health Check
            </h1>
            <p className="text-gray-600">
              System status and performance metrics
            </p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {healthData.status.toUpperCase()}
              </div>
              <div className="text-sm text-green-700">Status</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {healthData.uptime}
              </div>
              <div className="text-sm text-blue-700">Uptime</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {healthData.environment}
              </div>
              <div className="text-sm text-purple-700">Environment</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                System Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Platform:</span>
                    <span className="ml-2 text-gray-600">
                      {healthData.platform}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Node Version:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {healthData.nodeVersion}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Timestamp:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {healthData.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Memory Usage
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Used:</span>
                    <span className="ml-2 text-gray-600">
                      {healthData.memory.used}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="ml-2 text-gray-600">
                      {healthData.memory.total}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">External:</span>
                    <span className="ml-2 text-gray-600">
                      {healthData.memory.external}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
