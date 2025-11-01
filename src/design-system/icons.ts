/**
 * Icon Mapping: Lucide Icons → SF Symbols
 *
 * Maps commonly used Lucide icon names to their SF Symbols equivalents
 * For icons without direct SF Symbol equivalents, we'll need to bundle custom icons
 */

export const iconMapping: Record<string, string> = {
  // Common Actions
  'plus': 'plus',
  'minus': 'minus',
  'x': 'xmark',
  'check': 'checkmark',
  'chevron-right': 'chevron.right',
  'chevron-left': 'chevron.left',
  'chevron-up': 'chevron.up',
  'chevron-down': 'chevron.down',
  'arrow-right': 'arrow.right',
  'arrow-left': 'arrow.left',
  'arrow-up': 'arrow.up',
  'arrow-down': 'arrow.down',

  // UI Elements
  'menu': 'line.3.horizontal',
  'more-vertical': 'ellipsis',
  'more-horizontal': 'ellipsis',
  'settings': 'gearshape',
  'search': 'magnifyingglass',
  'filter': 'line.3.horizontal.decrease.circle',
  'edit': 'pencil',
  'trash': 'trash',
  'copy': 'doc.on.doc',
  'download': 'arrow.down.circle',
  'upload': 'arrow.up.circle',
  'share': 'square.and.arrow.up',
  'external-link': 'arrow.up.right.square',

  // Files & Folders
  'file': 'doc',
  'file-text': 'doc.text',
  'file-code': 'doc.plaintext',
  'folder': 'folder',
  'folder-open': 'folder.fill',

  // Communication
  'mail': 'envelope',
  'send': 'paperplane',
  'message-circle': 'bubble.left',
  'message-square': 'message',
  'phone': 'phone',
  'video': 'video',
  'mic': 'mic',
  'mic-off': 'mic.slash',

  // Media
  'image': 'photo',
  'camera': 'camera',
  'play': 'play.fill',
  'pause': 'pause.fill',
  'stop': 'stop.fill',
  'volume': 'speaker.wave.2',
  'volume-off': 'speaker.slash',

  // User & People
  'user': 'person',
  'users': 'person.2',
  'user-plus': 'person.badge.plus',
  'user-minus': 'person.badge.minus',
  'user-check': 'person.badge.checkmark',

  // Navigation
  'home': 'house',
  'compass': 'safari',
  'map': 'map',
  'navigation': 'location',

  // Time & Calendar
  'clock': 'clock',
  'calendar': 'calendar',
  'calendar-days': 'calendar',

  // Alerts & Status
  'info': 'info.circle',
  'alert-circle': 'exclamationmark.circle',
  'alert-triangle': 'exclamationmark.triangle',
  'alert-octagon': 'octagon',
  'help-circle': 'questionmark.circle',
  'check-circle': 'checkmark.circle',
  'x-circle': 'xmark.circle',

  // Common UI
  'heart': 'heart',
  'star': 'star',
  'bookmark': 'bookmark',
  'tag': 'tag',
  'lock': 'lock',
  'unlock': 'lock.open',
  'eye': 'eye',
  'eye-off': 'eye.slash',
  'sun': 'sun.max',
  'moon': 'moon',
  'cloud': 'cloud',

  // Code & Development
  'code': 'chevron.left.forwardslash.chevron.right',
  'terminal': 'terminal',
  'git-branch': 'arrow.triangle.branch',
  'git-commit': 'circle.fill',
  'github': 'chevron.left.forwardslash.chevron.right', // No direct SF Symbol

  // AI SDK Specific
  'sparkles': 'sparkles',
  'brain': 'brain.head.profile', // iOS 17+
  'cpu': 'cpu',
  'database': 'externaldrive',
  'server': 'server.rack',
  'layers': 'square.3.layers.3d',
  'link': 'link',
  'paperclip': 'paperclip',
  'refresh': 'arrow.clockwise',
  'rotate-cw': 'arrow.clockwise',
  'rotate-ccw': 'arrow.counterclockwise',
  'zoom-in': 'plus.magnifyingglass',
  'zoom-out': 'minus.magnifyingglass',
  'maximize': 'arrow.up.left.and.arrow.down.right',
  'minimize': 'arrow.down.right.and.arrow.up.left',
  'sidebar': 'sidebar.left',
  'panel-left': 'sidebar.left',
  'panel-right': 'sidebar.right',
  'columns': 'rectangle.split.3x1',
  'grid': 'square.grid.2x2',
  'list': 'list.bullet',
};

/**
 * Get SF Symbol name for a Lucide icon
 * Falls back to 'questionmark.circle' if not found
 */
export function getSFSymbol(lucideName: string): string {
  return iconMapping[lucideName] || 'questionmark.circle';
}

/**
 * Common icon names organized by category
 */
export const iconCategories = {
  actions: ['plus', 'minus', 'x', 'check', 'edit', 'trash', 'copy', 'share'],
  navigation: ['chevron-right', 'chevron-left', 'arrow-right', 'arrow-left', 'home', 'menu'],
  communication: ['mail', 'send', 'message-circle', 'phone', 'video', 'mic'],
  files: ['file', 'file-text', 'folder', 'download', 'upload'],
  user: ['user', 'users', 'user-plus', 'user-check'],
  alerts: ['info', 'alert-circle', 'alert-triangle', 'check-circle', 'x-circle'],
  media: ['image', 'camera', 'play', 'pause', 'volume'],
  ai: ['sparkles', 'brain', 'cpu', 'layers', 'link'],
} as const;
