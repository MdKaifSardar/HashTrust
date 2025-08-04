// filepath: e:\CSE\blockchain-verification\src\components\Loader\index.tsx
"use client";

import React from "react";

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-2 text-blue-600 font-medium">Processing...</span>
  </div>
);

export default Loader;
