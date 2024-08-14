'use client'
import { SWRConfig } from 'swr';

const CustomSWRConfig = ({ children, ...config }) => {
  console.log('Rendering CustomSWRConfig');
  return (
    <SWRConfig value={config}>
      {children}
    </SWRConfig>
  );
};

export default CustomSWRConfig;