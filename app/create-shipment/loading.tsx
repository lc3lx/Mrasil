export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa]">
      <div className="v7-loading-logo mb-8 v7-pulse">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 16V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.07989 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.0799 3 7.2V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 20.5L4.9 18.7C5.28771 18.2248 5.48157 17.9872 5.72299 17.8285C5.93841 17.6851 6.17819 17.5846 6.4315 17.5321C6.71576 17.4722 7.01875 17.4722 7.62472 17.4722H16.3753C16.9813 17.4722 17.2842 17.4722 17.5685 17.5321C17.8218 17.5846 18.0616 17.6851 18.277 17.8285C18.5184 17.9872 18.7123 18.2248 19.1 18.7L20.5 20.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 13L9.80705 12.3071C9.5211 12.0211 9.37812 11.8781 9.21547 11.7966C9.07245 11.7244 8.91212 11.6862 8.74807 11.6848C8.56255 11.6833 8.37155 11.7501 7.98954 11.8837L7.5 12.0732M13.5 9L14.3383 9.83835C14.6342 10.1342 14.7822 10.2822 14.9546 10.3635C15.1068 10.4358 15.2775 10.4736 15.4496 10.4749C15.6435 10.4764 15.8418 10.4102 16.2383 10.2779L16.5 10.1863"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex space-x-2 space-x-reverse">
        <div className="w-3 h-3 rounded-full bg-[#3498db] v7-loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-[#3498db] v7-loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-[#3498db] v7-loading-dot"></div>
      </div>
      <p className="mt-4 text-[#1a365d] font-medium">جاري تحميل نموذج إنشاء الشحنة...</p>
    </div>
  )
}
