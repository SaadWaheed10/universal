import { PermissionsAndroid, Platform } from 'react-native';
import {
  CameraRoll,
  iosRequestAddOnlyGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { extensionForMedia, guessMediaKind } from '../utils/url';

export type GallerySaveResult = {
  localFilePath: string;
  galleryUri: string;
  kind: 'video' | 'photo';
};

export type DownloadFileOptions = {
  sourceUrl: string;
  headers?: Record<string, string>;
  onProgress?: (ratio: number) => void;
};

/**
 * Download a remote media file and save it to Photos (iOS) / Gallery (Android).
 * Also keeps a persistent copy under Documents for in-app playback.
 */
export async function downloadAndSaveToGallery(
  options: DownloadFileOptions,
): Promise<GallerySaveResult> {
  const { sourceUrl, headers = {}, onProgress } = options;
  await ensureGalleryPermission();

  const headKind = guessMediaKind(sourceUrl);
  const ext = extensionForMedia(headKind, undefined, sourceUrl);
  const filename = `universal-${Date.now()}.${ext}`;
  const cachePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${filename}`;

  const response = await fetchWithHeaders(
    sourceUrl,
    headers,
    cachePath,
    onProgress,
  );
  const status = response.info().status;
  if (status < 200 || status >= 300) {
    if (status === 403 || status === 401) {
      throw new Error(
        'Download blocked by the media host (HTTP 403). Social CDNs often reject direct fetches — try another link, or a direct .mp4 / image URL.',
      );
    }
    throw new Error(`Download failed (HTTP ${status}).`);
  }

  const responseHeaders = response.info().headers ?? {};
  const contentType = String(
    responseHeaders['Content-Type'] ??
      responseHeaders['content-type'] ??
      '',
  );
  const kind = guessMediaKind(sourceUrl, contentType);
  const downloadedPath = response.path();

  // Keep a durable copy for in-app playback (cache can be wiped by iOS).
  const mediaDir = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/UniversalMedia`;
  try {
    const exists = await ReactNativeBlobUtil.fs.isDir(mediaDir);
    if (!exists) {
      await ReactNativeBlobUtil.fs.mkdir(mediaDir);
    }
  } catch {
    // Directory may already exist.
  }

  const persistentPath = `${mediaDir}/${filename}`;
  try {
    const already = await ReactNativeBlobUtil.fs.exists(persistentPath);
    if (!already) {
      await ReactNativeBlobUtil.fs.cp(downloadedPath, persistentPath);
    }
  } catch {
    // Fall back to the downloaded cache path if copy fails.
  }

  const playablePath = (await ReactNativeBlobUtil.fs.exists(persistentPath))
    ? persistentPath
    : downloadedPath;

  const fileUri = playablePath.startsWith('file://')
    ? playablePath
    : `file://${playablePath}`;

  const asset = await CameraRoll.saveAsset(fileUri, {
    type: kind,
    album: 'Universal',
  });

  return {
    localFilePath: playablePath,
    galleryUri: asset.node.image.uri,
    kind,
  };
}

function fetchWithHeaders(
  sourceUrl: string,
  headers: Record<string, string>,
  path: string,
  onProgress?: (ratio: number) => void,
) {
  const task = ReactNativeBlobUtil.config({
    fileCache: true,
    path,
  }).fetch('GET', sourceUrl, headers);

  task.progress({ interval: 200 }, (received, total) => {
    if (!onProgress) {
      return;
    }
    const totalNum = Number(total);
    const receivedNum = Number(received);
    if (totalNum > 0) {
      onProgress(Math.min(1, receivedNum / totalNum));
    }
  });

  return task;
}

async function ensureGalleryPermission(): Promise<void> {
  if (Platform.OS === 'ios') {
    const status = await iosRequestAddOnlyGalleryPermission();
    if (status !== 'granted' && status !== 'limited') {
      throw new Error(
        'Photo Library permission is required to save downloads to Photos.',
      );
    }
    return;
  }

  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);
      const imagesOk =
        result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const videoOk =
        result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        PermissionsAndroid.RESULTS.GRANTED;
      if (!imagesOk && !videoOk) {
        throw new Error(
          'Gallery permission is required to save downloads on Android.',
        );
      }
      return;
    }

    if (Platform.Version <= 29) {
      const write = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (write !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error(
          'Storage permission is required to save downloads on Android.',
        );
      }
    }
  }
}
