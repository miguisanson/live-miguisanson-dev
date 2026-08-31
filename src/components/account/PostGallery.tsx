import Image from "next/image";

/**
 * Attached images on a community post.
 *
 * One image runs full width; two or more tile in a grid, the way Reddit and
 * most feeds present a gallery. Uploads are user content served from
 * /media/posts, so they are marked `unoptimized` — running arbitrary uploads
 * through the image optimiser is a needless amount of work on the server for
 * files that are already size-capped at upload.
 */
export function PostGallery({ images, alt }: { images: string[]; alt: string }) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`post-gallery post-gallery--${Math.min(images.length, 4)}`}>
      {images.map((src, index) => (
        <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="post-gallery-item">
          <Image
            src={src}
            alt={images.length > 1 ? `${alt} — image ${index + 1} of ${images.length}` : alt}
            width={800}
            height={800}
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
