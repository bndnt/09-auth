import css from "./Home.module.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "NoteHub — Not found",
  description: "This page doesn`t exist or was deleted.",

  openGraph: {
    title: "NoteHub 404 - Page doesn`t exist",
    description: "This page doesn`t exist or was deleted.",
    url: "https://08-zustand-valeriia-makushchenko.vercel.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "not found page",
      },
    ],
  },
};
function NotFound() {
  return (
    <div className={css.error}>
      <div className={css.errorBg}>
        <video
          src="https://videos.pexels.com/video-files/856857/856857-uhd_2732_1440_30fps.mp4"
          autoPlay={true}
          loop={true}
        ></video>
      </div>
      <div className={css.errorText}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
export default NotFound;
