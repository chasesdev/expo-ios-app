import React from 'react';
import {
  Host as ExpoHost,
  type HostProps as ExpoHostProps,
} from '@expo/ui/swift-ui';

/**
 * Wrapper around Expo's SwiftUI Host that defaults to matching content height.
 * This avoids zero-height hosts after the 0.2.x upgrade which changed layout
 * sizing behaviour.
 */
export function Host(props: ExpoHostProps) {
  const { matchContents, ...rest } = props;
  const resolvedMatchContents = matchContents ?? { vertical: true };

  return <ExpoHost matchContents={resolvedMatchContents} {...rest} />;
}

export type HostProps = ExpoHostProps;
