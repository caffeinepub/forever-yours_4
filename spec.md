# Forever Yours

## Current State
New project. Empty backend and frontend scaffolding only.

## Requested Changes (Diff)

### Add
- A romantic personal gift app with baby pink and white theme
- Landing/hero section with romantic couple imagery and a warm welcome message
- Love Letters section: display and store text love letters with elegant typography
- Audio Messages section: upload and playback audio recordings with waveform-style UI
- Videos section: upload and watch personal video messages
- Pictures / Gallery section: upload and view photos in a soft gallery layout
- Small icons for each section (heart, envelope, music note, video camera, camera)
- Soft background with subtle romantic decorative elements (petals, hearts)
- Authorization so only the couple can access their private content
- Blob storage for audio, video, and image files

### Modify
- None

### Remove
- None

## Implementation Plan
1. Select authorization and blob-storage components
2. Generate Motoko backend: love letters CRUD, metadata for audio/video/photos stored in blob storage
3. Build frontend: baby pink/white theme, hero section, tabbed navigation with icons, love letters editor/viewer, audio player, video player, photo gallery
4. Wire blob-storage uploads for audio, video, images
5. Deploy
