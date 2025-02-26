import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// This component is needed to use react-router-dom Link with Material UI components
export const LinkBehavior = forwardRef<HTMLAnchorElement, {to: string; children?: React.ReactNode}>(
  (props, ref) => <RouterLink ref={ref} to={props.to} {...props} />
); 