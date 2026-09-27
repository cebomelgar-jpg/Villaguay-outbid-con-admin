'use client';

import ThemeSwitcher from './ThemeSwitcher';
import AudioMuteButton from './AudioMuteButton';

export default function FloatingControls() {
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <ThemeSwitcher />
      <AudioMuteButton />
    </div>
  );
}
