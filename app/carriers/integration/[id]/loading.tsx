import V7Layout from "@/components/v7/v7-layout"

export default function CarrierIntegrationLoading() {
  return (
    <V7Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center mb-6">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded mr-2"></div>
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="v7-neu-card p-6 rounded-xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex-grow">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
          </div>
          <div className="mt-8 flex justify-end">
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </V7Layout>
  )
}
