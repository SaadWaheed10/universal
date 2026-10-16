import ReactNativeBlobUtil from 'react-native-blob-util';

/** Delete on-device UniversalMedia copies used for in-app playback. */
export async function clearLocalMediaFiles(): Promise<void> {
  const mediaDir = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/UniversalMedia`;
  try {
    const exists = await ReactNativeBlobUtil.fs.isDir(mediaDir);
    if (exists) {
      await ReactNativeBlobUtil.fs.unlink(mediaDir);
    }
  } catch {
    // Best-effort cleanup — gallery copies are never touched.
  }
}
