import catalogPhotos from "@/data/catalogPhotos.json";
import photos from "@/data/photoCredits.json";
import { Link } from "react-router-dom";

export default function PhotoCredit({ id }: { id: string }) {
  const catalog = (catalogPhotos as Record<string, { source: string; publisher: string }>)[id];
  if (catalog) return <p className="mt-2 text-xs leading-5 text-muted-foreground">Ảnh công bố bởi <a href={catalog.source} target="_blank" rel="noreferrer" className="underline">{catalog.publisher}</a> · <Link to="/sources" className="underline">Thông tin ảnh</Link></p>;
  const photo = (
    photos as Record<
      string,
      { source: string; author: string; license: string }
    >
  )[id];
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      {photo ? (
        <>
          Ảnh: {photo.author} ·{" "}
          <a
            href={photo.source}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Wikimedia Commons
          </a>{" "}
          · {photo.license} ·{" "}
          <Link to="/sources" className="underline">
            Thông tin ảnh
          </Link>
        </>
      ) : (
        <>
          Chưa có ảnh được xác minh cho địa điểm này. Không dùng ảnh của địa
          điểm khác để thay thế.
        </>
      )}
    </p>
  );
}
